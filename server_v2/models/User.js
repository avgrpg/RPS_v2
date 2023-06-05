import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
    },
    EID: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    }
  },
  { timestamps: true } //automatically adds time stamp
);

const User = mongoose.model("User", UserSchema);
export default User;
