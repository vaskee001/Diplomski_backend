const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message,logName) => {
  const dateTime = `${format(new Date(), "yyyy/MM/dd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}`;

  try {
    try {
      await fsPromises.stat(path.join(__dirname,'..', "log"));
      await fsPromises.appendFile(
        path.join(__dirname,'..', "log", logName),
        logItem + "\n"
      );
    } catch (nou) {
      await fsPromises.mkdir(path.join(__dirname,'..', "log"));
      await fsPromises.appendFile(
        path.join(__dirname, "log",'..', logName),
        logItem + "\n"
      );
      
    }
  } catch (err) {
    console.log(err);
  }
};

const logger = (req,res,next)=>{
  logEvents(`${req.method}\t${req.headers.origin}\t${req.path}`,'reqLog.txt');
  next();
};


module.exports = {logEvents , logger};
