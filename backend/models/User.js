const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
    linksCount: {
    type: Number,
    default: 0, // Contador de enlaces acortados
  },
},
 { timestamps: true 
});

module.exports = mongoose.model("User", userSchema);
