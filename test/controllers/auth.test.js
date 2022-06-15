const app = require("../../controllers/auth");
const login = app.login;

/*const request = require("supertest");
//request = request('http://localhost:5555');
const app = require("../../controllers/auth");
const login = app.login;
 
it('should return Hello Test', function (done) {
  request(app).post('/').expect('Invalid username/password supplied').end(done);
});
/*
it("should return Hello Test", function(done){
     
    request(app)
        .post("/login")
        .expect("400")
        .end(done);
});

describe('POST /users', function() {
  it('responds with json', function(done) {
    request(app)
      .post('/login')
      .send({email: 'john'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  });
});*/