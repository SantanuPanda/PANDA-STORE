const mongoose=require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  photo: { type: String, default: "" },
  cartData: { type: Object, default: {} },
},{minimize: false, timestamps: true});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = UserModel;