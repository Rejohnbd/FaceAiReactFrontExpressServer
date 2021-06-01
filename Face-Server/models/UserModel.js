const mongoose = require("mongoose");

const UserModel = mongoose.Schema({
  nidNo: { type: String, required: true },
  userName: { type: String },
  dateOfBirth: { type: Date },
  currentPayPoint: { type: String },
  pensiontype: { type: String },
  userImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserInfo", UserModel);
