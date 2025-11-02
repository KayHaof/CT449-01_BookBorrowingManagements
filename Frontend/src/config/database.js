const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("=> MongoDB database connect success !!!");

  } catch (err) {
    console.error("=> MongoDB connection error: ", err);
    process.exit(1);
  }
}

module.exports = connectDB;