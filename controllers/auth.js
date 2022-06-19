const db = require('../db')

//const {secret} = require('../configs.js');
const secret = process.env.secret;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAcessToken = (id) => {
  const payload = {id};
  return jwt.sign(payload, secret);
};

module.exports.login = async function(req, res) {
  
  const {email, password} = req.body;

  if ((!email) || (!password)) {
    return res.status(400).json(`Invalid username/password supplied`);
  };

  const textQuery = `SELECT * FROM users WHERE email = '${email}'` 
  try {  
    const findUser = await db.query(textQuery) 
    
    if (findUser.rowCount === 0 ) {
      return res.status(400).json(`Not find email ${email}`);
    };

    User = findUser.rows[0]
    
    const isPasswordValid = bcrypt.compareSync(password, User.password); 

    if (!isPasswordValid) {
      return res.status(400).json('Password wrong, please enter again!');
    };

    const token = generateAcessToken(User.id);
    return res.status(200).json({
      token: `Bearer ${token}`
    })
  } catch (error) {
      
      console.log(error);
      return res.status(500).json({message: 'Error - ' + error});
    }
}

module.exports.register = async function(req, res) {

  const {email, password} = req.body;

  if ((!email) || (!password)) {
    return res.status(400).json(`Invalid username/password supplied`);
  };

  const hashPassword = bcrypt.hashSync(password, 7);
  const text = 'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *'
  const values = [email, hashPassword]
  try {
   
    const newUsers = await db.query(text, values)
    res.status(200).json({
       description: "Successful operation"
   })
  } catch (err) {
  
    console.log(err.stack)
    res.status(400).json({
      error: err.stack
    });
  }
}