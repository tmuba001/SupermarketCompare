//importing dependencies = npm i 
const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

//where is the file (must have env)
dotenv.config({path: 'node_modules/.env' })

//start the server with this app 
const app = express();

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

//css and javascript implementation (folder)
//console.log(__dirname) = find your current position 
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//grabe data from any forms 
app.use(express.urlencoded({extended:false}));
//values are joson 
app.use(express.json());
app.use(cookieParser());

//which engine is going to help display html 
app.set('view engine', 'hbs');

//create the connection to the datatbase (terminal display) 
db.connect((error) => {
//errors 
    if(error){
        console.log(error)
    } else {
        console.log("MYSQL Connected...")
    }
})

//define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

//npm start: starts the server 
app.listen(5000, () => {
    //make sure it is running 
    console.log("Server started on Port 5000")
})
 