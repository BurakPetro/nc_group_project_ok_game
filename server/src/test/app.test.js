const request = require('supertest');
const app = require('../app.js');

describe('/api/hello', () => {
  test('GET:200', () => {
    return request(app)
      .get('/api/hello')
      .expect(200)
      .then((body) => {
        expect(body.text).toBe('HELLO');
      });
  });
});
