const request = require('supertest');
const app = require('./index');

jest.mock('mysql2', () => {
  return {
    createConnection: jest.fn(() => ({
      connect: jest.fn(),
      query: jest.fn(),
    })),
  };
});

describe('POST /update-email', () => {
  beforeEach(() => {
    app.locals.userdb = {
      query: jest.fn(),
    };
  });

  it('responds with success message if email is updated', async () => {
    app.locals.userdb.query.mockImplementation((query, values, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .post('/update-email')
      .send({ email: 'newemail@example.com' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true, message: 'Email updated' }); 
  });

  it('responds with error message if email is already in use', async () => {
    app.locals.userdb.query.mockImplementation((query, values, callback) => {
      callback(null, [{ 'w@w' }]);
    });

    const response = await request(app)
      .post('/update-email')
      .send({ email: 'existingemail@example.com' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: false, message: 'Email in use' });
  });
});
