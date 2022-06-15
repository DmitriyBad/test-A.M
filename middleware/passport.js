const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('../db')

const {secret} = require('../configs.js');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
}

module.exports = passport => {
  passport.use(
    new jwtStrategy(options, async (payload, done) => {

      const textQuery = `SELECT * FROM users WHERE id = '${payload.id}'` 
      try {
        const user = await db.query(textQuery) 
        
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }}
      catch (error) {
        console.log(error)  
      }  

    })
  )
}