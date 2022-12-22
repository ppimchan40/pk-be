const config = require('../config');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const boot = async () => {
  // Connect to mongodb
  try {
    
    //await mongoose.connect(config.mongodbURI, config.mongodb);
  await mongoose.connect("mongodb+srv://jsd3-3-final-project:jsd3-3-final-project@fitclub.ce61urd.mongodb.net/test", {useNewUrlParser:true});
    console.log("DB Connection")
  } catch (error) {
    console.log(error)
  }
  //await mongoose.connect("mongodb+srv://jsd3-3-final-project:jsd3-3-final-project@fitclub.ce61urd.mongodb.net/test", {useNewUrlParser:true} )
  // Start express server
};

module.exports = boot
