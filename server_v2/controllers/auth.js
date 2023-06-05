import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register
export const register = async (req, res) => {
  try {
    const { username, EID, password, examHosted } = req.body;

    const user = await User.findOne({ EID:EID });
    if(user){
      return res.status(400).json({ message: "User EID already exist" });
    }

    // get random salt for encrypting password
    const salt = await bcrypt.genSalt(10);
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = new User({
      username,
      EID,
      password: hashedPassword,
      examHosted,
    });
    // save user
    const savedUser = await newUser.save();
    //
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
    try{
        const { EID, password } = req.body;
        // find user with EID
        const user = await User.findOne({ EID:EID });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        // check password
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json({ message: "Invalid password" });
        }
        // create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_SECRET, {
            expiresIn: "1h",
        });
        delete user.password;
        // 
        res.status(200).json({ token , user});

    }catch(err){
        res.status(500).json({ message: err.message });
    }
};