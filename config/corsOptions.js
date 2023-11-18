const allowedOrigins=require('./allowedOrigins');
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin){
      callback(null,true);
    } else{
      callback(new Error('Nije dozvoljeno od strane CORS'))
    }
  }, optionSuccesStatus:200
}

module.exports = corsOptions;