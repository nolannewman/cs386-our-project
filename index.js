if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const userdb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'PASSWORD',
  database: 'muscleMemory'
})

userdb.connect((err) => {
  if (err) throw err
  console.log('Connected to database')
})

// express setup
const app = express()
app.use(flash())
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

passport.use(new LocalStrategy(
    (username, password, done) => {
        userdb.query('SELECT * FROM mmUser WHERE username = ?', [username], (err, results) => {
            if (err) return done(err);
            if (results.length === 0) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            const user = results[0];
            bcrypt.compare(password, user.pword, (err, isMatch) => {
                if (err) return done(err);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        });
    }
));

passport.serializeUser((user, done) => done(null, user.username));
passport.deserializeUser((username, done) => {
    userdb.query('SELECT * FROM mmUser WHERE username = ?', [username], (err, results) => {
        if (err) return done(err);
        done(null, results[0]);
    });
});

app.get('/', (req, res) => {
  res.render('index.ejs', {isAuthenticated: req.isAuthenticated(), name: req.user ? req.user.username : ''})
})

app.get('/settings', checkAuthenticated, (req, res) => {
    res.render('settings.ejs', {isAuthenticated: req.isAuthenticated(), name: req.user? req.user.username : '', email: req.user? req.user.email : ''})
})

app.post('/update-email', (req, res) => {
    const { email } = req.body
    const name = req.user.username
    const query = 'UPDATE mmUser SET email = ? WHERE username = ?'

    // check if email used
    userdb.query("SELECT * FROM mmUser WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error('Error checking existing users:', err)
            return res.status(500).send('An error occurred.')
        }

        if(results.length > 0) {
            return res.json({ success: false, message: "Email in use"})
        }
        else {
            // overwrite email
            userdb.query(query, [email, name], (error, results) => {
                if (error) {
                    console.error('Error updating email:', error)
                    return res.status(500).send('An error occurred.')
                }
                console.log('Email updated for user:', name)
                res.json({success : true, message: "Email updated"})
            })
        }
    })
})

app.post('/update-password', (req, res) => {
    const { newpassword, oldpassword } = req.body
    const name = req.user.username
    const newpword = bcrypt.hashSync(newpassword, 8)
    const query = 'UPDATE mmUser SET pword = ? WHERE username = ?'

    // check if passwords match
    bcrypt.compare(oldpassword, req.user.pword, (err, isMatch) => {
        if(err) return done(err);
        if( isMatch ) {
            // rewrite password
            userdb.query(query, [newpword, name], (error, results) => {
                if(error) {
                    console.error('Error updating password:', error)
                    return res.status(500).send('An error occurred.')
                }
                console.log('Password updated for user:', name)
                res.json({success : true, message: "Password updated"})
            })
        }
        else {
            console.log('Failed password change attempt for user:', name)
            res.json({success: true, message: "Incorrect password"})
        }
    })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.get('/blog', checkAuthenticated, (req, res) => {
  res.render('blog.ejs')
})

app.post('/post', checkAuthenticated, (req, res) => {
  const { title, content } = req.body
  const poster = req.user.username

  userdb.query('SELECT COUNT(*) AS count FROM blogPost', (err, results) => {
    if(err) {
        console.error('Error counting posts:', err);
    }

    const postCount = results[0].count;
    const post_id = postCount + 1;
    const query = 'INSERT INTO blogPost (post_id, title, content, poster) VALUES (?, ?, ?, ?)'
    userdb.query(query, [post_id, title, content, poster], (err, results) => {
        if (err) {
            console.error('Error inserting post:', err)
            return res.status(500).send('An error occurred while posting.')
        }
        res.redirect('/posts')
      })
  })
})

app.get('/posts', (req, res) => {
    const query = 'SELECT * FROM blogPost ORDER BY post_id DESC'
    userdb.query(query, (err, results) => {
        if(err) {
            console.error('Error fetching posts:', err)
            return res.status(500).send('An error occurred fetching posts.')
        }
        res.render('posts.ejs', { posts: results });
    })
})

app.get('/Resources', (req, res) => {
  res.render('Resources.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    userdb.query('SELECT * FROM mmUser WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) {
            console.error('Error checking existing users:', err);
            return res.status(500).send('An error occurred.');
        }

        if (results.length > 0) {
            // User found with the same username or email
            return res.status(400).send('Username or email already in use.');
        }

        // If no existing user, proceed with registration
        const hashedPassword = bcrypt.hashSync(password, 8);

        userdb.query('INSERT INTO mmUser (username, email, pword) VALUES (?, ?, ?)', [username, email, hashedPassword], (insertErr) => {
            if (insertErr) {
                console.error('Error during registration:', insertErr);
                return res.status(500).send('An error occurred during registration.');
            }

            res.redirect('/login');
        });
    });
});

app.get('/calories', checkAuthenticated, (req, res) => {
    res.render('calories.ejs')
})

app.post('/update-calories', (req, res) => {
    const calculatedBMR = parseFloat(req.body.calculatedBMR)
    const name = req.user.username
    console.log('BMR:', calculatedBMR)
    userdb.query('UPDATE mmUser SET bmr = ? WHERE username = ?', [calculatedBMR, name], (err, results) => {
        if(err) {
            console.error('Error updating BMR:', err)
            return res.status(500).send('An error occurred.')
        }
        else {
            console.log('BMR updated for user:', name, calculatedBMR)
        }
    })
})

app.delete('/logout', (req, res) => {
  req.logOut(function(err) {
    if(err) { return next(err) }
    res.redirect('/')
  })
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next ) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)
