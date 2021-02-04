//added itself 
const { merge } = require("../routes/auth");

//import security 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//conection to database 
const mysql = require("mysql");

//values for the database 
const db = mysql.createConnection({
    // when running on a server using 'IP' address 
    host: process.env.DATABASE_HOST,
    //defult features from xamp
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    //creating a connection  to database 
    database: process.env.DATABASE
});

//login pages rendered
exports.login = async (req, res) => {
    try{
        //grabbing from html
        const{ email, password} = req.body;

        //missing details 
        if(!email || !password ){
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            }) 
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) =>{

            console.log(results);
            //incorect password for email 
            if(!results || !(await bcrypt.compare(password, results[0].password))) 
            res.status(401).render('login', {
                message: 'The provided email or password is incorrect'
            })
            else{
                const id = results[0].id;
                //cookies 
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);
                //set tocken in cookies 
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                //setting up cookies 
                res.cookie('jwt', token, cookieOptions);
                //everything is fine, go home 
                res.status(200).redirect("/");
            }
        })

    }catch(error){
        //if their is an error tell me 
        console.log(error);
    }
}

//getting respons after submitting 
exports.register = (req, res) => {
    console.log(req.body);

//variables for registering 
const {name, email, password, passwordConfirm}  = req.body;

   //start querying 
  db.query('SELECT  email FROM users WHERE email = ?', [email], async (error, results) => {
   //what is the problem 
    if(error){
          console.log(error);
      }
      //wrong email 
      if(results.length > 0){
          return res.render('register', {
              message: 'Tha email provided is already in use'
          })
      }
      //password check 
      else if(password !== passwordConfirm){

        return res.render('register', {
            message: 'The passwords do not match'
        });

      }
        //five rounds of encription 
      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      //adding user from the register page 
      db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
          if(error){
              console.log(error);
          } else {
              console.log(results);
            return res.render('register', {
                message: 'User registered'
            });
          }
      })
    });

}

