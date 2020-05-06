const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const url = "mongodb+srv://lexluthar:lexluthar@cluster0-jjzmt.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(url , { 
//  useMongoClient: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", url);
});

db.on("error", (err) => {
  console.error("connection error:", err);
});
module.exports =  mongoose;