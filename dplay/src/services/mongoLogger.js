const mongoose=require('mongoose');
const logger=require('../utils/logger');
let connected=false;
async function connectMongo(uri){
  if(!uri) throw new Error('No MONGODB_URI');
  await mongoose.connect(uri,{dbName:'whatsapp_bot'});
  connected=true;
  logger.info('Connected to MongoDB');
}
module.exports={connectMongo,connected};
