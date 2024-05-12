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
const { spawn } = require('child_process'); // Import spawn from child_process

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
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh',require('./routes/refresh'));
app.use('/logout',require('./routes/logout'));

//RUST PROCESS
let rustProcess;
let rustOutput = '';


function createRustProcess() {
  // Replace with the path to your Rust executable
  rustProcess = spawn('./target/release/cli.exe', { stdio: 'pipe' });

  rustProcess.stdout.on('data', (data) => {
    console.log('Rust Output:', data.toString());
    const outputString = data.toString();
    if (outputString.includes("New messages")) {
      rustOutput = outputString; // Update rustOutput only when "New messages" is present
    }
  });

  rustProcess.stderr.on('data', (data) => {
    console.error('Rust Error:', data.toString());
    rustOutput = data.toString().trim();
    // You can emit this error to clients if you're using WebSocket or another real-time communication method
  });

  rustProcess.on('close', (code) => {
    console.log(`Rust process exited with code ${code}`);
  });
}

createRustProcess();
// Route to start the Rust process
app.get('/start-rust', (req, res) => {
  createRustProcess();
  res.send('Rust process started');
});

// Endpoint to exit the Rust process
app.post('/exit-rust', (req, res) => {
  if (rustProcess) {
      rustProcess.kill('SIGINT'); // Send SIGINT signal to gracefully exit the process
      rustProcess = null; // Reset the rustProcess variable
      res.send('Rust process exited');
  } else {
      res.status(500).send('Rust process not started');
  }
});

// Endpoint to restart the Rust process
app.post('/restart-rust', (req, res) => {
  // First, exit the existing Rust process if it's running
  if (rustProcess) {
      rustProcess.kill('SIGINT');
      rustProcess = null;
  }
  // Then, start a new Rust process
  createRustProcess();
  res.send('Rust process restarted');
});

// Route to send commands to the Rust process
app.post('/send-command', express.json(), (req, res) => {
  const { command } = req.body;
  console.log(req.body); // OVO SKLANJAM POSLE
  if (rustProcess) {
    rustProcess.stdin.write(command + '\n');
    res.send('Command sent to Rust process');
  } else {
    res.status(500).send('Rust process not started');
  }
});

// Route to get Rust output
app.get('/rust-output', (req, res) => {
  // Send the rustOutput variable as the response
  res.send(rustOutput);
  
  rustOutput = "Updated data";
});


//Routes that need verifyJWT
app.use(verifyJWT);
app.use('/groups', require('./routes/api/groups'));
app.use('/groupsparticipants', require('./routes/api/groupsParticipants'));
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