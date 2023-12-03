require('dotenv').config();
const express =require('express');
const app= express();
const path = require("path");
const cors = require('cors');
const corsOptions=require('./config/corsOptions');
const mongoose= require('mongoose');
const connectDB= require('./config/dbConn');
const PORT = process.env.PORT || 3500;
const {logger, logEvents} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const { error } = require('console');
const verifyJWT=require('./middleware/verifyJWT');
const cookieParser=require('cookie-parser');
const credentials= require('./middleware/credentials');
const { verify } = require('crypto');

//Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//Built in middleware to handle urlencoded form data
app.use(express.urlencoded({extended: false}));

//Middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static
app.use(express.static(path.join(__dirname,'/public')));
app.use('/subdir',express.static(path.join(__dirname,'/public')));


//Routes
app.use('/',require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/subdir', require('./routes/subdir'));
app.use('/refresh',require('./routes/refresh'));
app.use('/logout',require('./routes/logout'));


//Routes that need verifyJWT
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));

app.all('/*',(req,res)=>{
  res.status(404);
  if (req.accepts('html')){
    res.sendFile(path.join(__dirname,'views','404.html'))
  } else
  if (req.accepts('json')){
    res.json({error:"404 not found"});
  } else
  {
    res.type('txt').send("404 not found");
  }
});

app.use(errorHandler);


mongoose.connection.once('open', ()=>{
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})