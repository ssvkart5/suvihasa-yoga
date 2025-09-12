const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsInsecure: false,
    retryWrites: false,
    serverSelectionTimeoutMS: 5000
  });
};

module.exports = connectDB;
