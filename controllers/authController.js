const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs")

const registerUser = async (req,res) => {
    const {fullName, email , password} = req.body;

    if(!fullName|| !email || !password){
        return res.status(400).send({message : "please fill all the fields"})
    }
    try{
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(403).send({message: "user already exist "})
        }

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt)
        const user = await User.create({
            fullName,
            email,
            password : hashed,
            profileImageUrl : ""
        })

        res.status(201).send({
            message :"user created successfully",
            id: user._id,
            // token: generateToken(user._id),
            user
         })
    }catch(err){
        res.status(500).send({message: "internal error" , err: err.message})
    }
    
}
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
         return res.status(400).send({message : "please filll all the fields"})

    }
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(403).send({message : "user not exist"})
        }
        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass){
            return res.status(404).send({message : "invalid user credentials"})
        }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
        res.cookie("token", token, {
        httpOnly: true, 
        secure: false, //
        maxAge: 3600000, 
        sameSite: 'lax'
    });

        res.status(200).send({message : "login successfully" , user, token})

    }catch(err){
        res.status(500).send({message : "internal error during login" , err : err.message })
    }

}
const getUserInfo = async (req,res) => {

    try{

        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(403).send({message: "user not found"})
        }
        res.status(200).send({message : "user fetch successfully" , user})

    }catch(err){
        res.status(500).send({message: "internal error during fetching user",
         err: err.message

        })
    }

}
// ✅ Add this function to your authController.js
// and add it to the module.exports at the bottom

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    if (!currentPassword || !newPassword) {
      return res.status(400).send({ message: "All fields are required" });
    }
  
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).send({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Current password is incorrect" });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
  
      res.status(200).send({ message: "Password changed successfully" });
    } catch (err) {
      res.status(500).send({ message: "Internal error", err: err.message });
    }
  };
  
  // Make sure to add changePassword to your module.exports:
  // module.exports = { registerUser, loginUser, getUserInfo, logout, changePassword };                     


const logout = async (req, res) => {
    try{

        res.cookie("token", "")
        res.send({message : "logout successfully"})
    }catch(err){
        res.send({message : "internal err during logout", err: err.message})
    }
}
module.exports = {registerUser,loginUser,getUserInfo, logout , changePassword};