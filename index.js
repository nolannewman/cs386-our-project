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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
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

    bcrypt.compare(oldpassword, req.user.pword, (err, isMatch) => {
        if(err) return done(err);
        if( isMatch ) {
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

app.get('/about', (req, res) => {
    res.render('about.ejs')
})

app.post('/post', checkAuthenticated, (req, res) => {
    const { title, content } = req.body
    const poster = req.user.username

    const query = 'INSERT INTO blogPost (title, content, poster) VALUES (?, ?, ?)'
    userdb.query(query, [title, content, poster], (err, results) => {
        if (err) {
            console.error('Error inserting post:', err)
            return res.status(500).send('An error occurred while posting.')
        }
        res.redirect('/posts')
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

// does not properly pull stuff by the data when loading
app.get('/foodlog', checkAuthenticated, (req, res) => {

    const name = req.user.username;
    const currentDate = new Date().toISOString().slice(0, 10);

    const query = 'SELECT * FROM foodLog WHERE username = ? AND day_eaten = ?';

    userdb.query(query, [ name, currentDate ], (err, results) => {
        if(err) {
            console.error('Error accessing food log:', err);
            return res.status(500).send('An error occurred accessing food log.');
        }
        res.render('foodlog.ejs', {foodLogs: results});
    })
})

app.get('/dashboard', checkAuthenticated, async (req, res) => {
    const username = req.user.username;
    const currentDate = new Date().toISOString().slice(0, 10);
    const maintenance = req.user.bmr;

    const query = 'SELECT SUM(calories_burnt) AS totalBurnt FROM exerciseLog where username = ? AND day_logged = ?';

    userdb.query(query, [username, currentDate], (err, results) => {
        if(err) {
            console.error('Error accessing exerciseLog:', err);
            return res.status(500).send('An error occurred accessing exercise log.');
        }
        const totalBurnt = results[0].totalBurnt;
        userdb.query('SELECT SUM(calories_eaten) AS totalEaten FROM foodLog WHERE username = ? AND day_eaten = ?', [username, currentDate], (err, results) => {
            if(err) {
                console.error('Error accessing foodLog:', err);
                return res.status(500).send('An error occurred accessing food log.');
            }
            const totalEaten = results[0].totalEaten;
            res.render('dashboard.ejs', { username, maintenance, totalBurnt, totalEaten });
        })
    })
})

app.post('/addFood', (req, res) => {
    const { food_name, calories_eaten, food_desc } = req.body;
    const username = req.user.username;
    const day_eaten = new Date().toISOString().slice(0, 10);

    const query = 'INSERT INTO foodLog (food_name, food_desc, calories_eaten, day_eaten, username) VALUES (?, ?, ?, ?, ?)';
    userdb.query(query, [food_name, food_desc, calories_eaten, day_eaten, username], (err, results) => {
        if (err) {
            console.error('Error inserting food:', err);
            return res.status(500).send('An error occurred while adding food.');
        }
        res.redirect('/foodlog');
    });
});

app.post('/editFood', (req, res) => {
    const { food_id, food_name, calories_eaten, food_desc } = req.body;
    const username = req.user.username;

    const query = 'UPDATE foodLog SET food_name = ?, calories_eaten = ?, food_desc = ? WHERE food_id = ? AND username = ?';

    userdb.query(query, [food_name, calories_eaten, food_desc, food_id, username], (err, results) => {
        if (err) {
            console.error('Error updating food:', err);
            return res.status(500).send('An error occurred while updating the food item.');
        }
        res.redirect('/foodlog');
    });
});

app.get('/exercise', checkAuthenticated, (req, res) => {
    const name = req.user.username;
    const currentDate = new Date().toISOString().slice(0, 10);

    const query = 'SELECT SUM(calories_burnt) AS totalCalories FROM exerciseLog where username = ? AND day_logged = ?';

    userdb.query(query, [name, currentDate], (err, results) => {
        if(err) {
            console.error('Error accessing exerciseLog:', err);
            return res.status(500).send('An error occurred accessing exercise log.')
        }
        const totalCalories = results[0].totalCalories;
        userdb.query('SELECT SUM(num_steps) AS totalSteps FROM exerciseLog where username = ? AND day_logged = ?', [name, currentDate], (err, results) => {
            if(err) {
                console.error('Error accessing steps:', err);
                return res.status(500).send('An error occurred accessing steps for the day.');
            }

        const totalSteps = results[0].totalSteps;

        res.render('exercise.ejs', { totalCalories, totalSteps });
        });
    });
})

app.post('/addExercise', (req, res) => {
    const { steps, calories } = req.body;
    const username = req.user.username;
    const day_logged = new Date().toISOString().slice(0, 10);

    if(steps) {
        log_steps = steps;
        calories_burnt = (steps / 1000) * 35;
    }
    else {
        log_steps = 0;
        calories_burnt = calories;
    }

    const query = 'INSERT INTO exerciseLog (num_steps, calories_burnt, day_logged, username) VALUES (?, ?, ?, ?)';

    userdb.query(query, [log_steps, calories_burnt, day_logged, username], (err, results) => {
        if(err) {
            console.error('Error logging exercise:', err);
            return res.status(500).send('An error occurred logging your exercise.');
        }
        res.redirect('/exercise');
    });
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

        userdb.query('INSERT INTO mmUser (username, email, pword, bmr) VALUES (?, ?, ?, -1)', [username, email, hashedPassword], (insertErr) => {
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

const server = app.listen(3000, () => console.log('Server running on http://0.0.0.0:3000/'));
module.exports = app;

