const User = require('../model/UserSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const controller ={
    getProfile: async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error("Error fetching profile", error);
        res.status(500).json({ message: "Server error" });
    }
},
    signUp: async(req , res ) => {
        try {
            const { username  , email , password } = req.body 

             if (!username || !email || !password) {
                  return res.status(400).json({ message: "All fields are required" });
                }

            const existingUser =await User.findOne({ email })
            if (existingUser) {
                return res.status(400).json({ message:'user already exist' })
            }

            const hashedpassword = await bcrypt.hash(password , 10 )

            const newUser = new User({ username , email ,  password:hashedpassword })
            await newUser.save()

            res.status(200).json('user created successfully')

        } catch (error) {
            console.error('cannot create new user' , error)
            res.status(500).json({ message:'server error while creating user' })
        }
    },
    login: async (req, res) => {
  try {
    const { username, password } = req.body; // change email → username

    const user = await User.findOne({ username }); // search by username
    if (!user) {
      return res.status(400).json({ message: "Username not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username }, // token can store username
      process.env.JWT_SECRET || "mySecretKey",
      { expiresIn: "24h" }
    );

    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      message: "Login successfully",
      token,
      user: userData // this contains the username
    });
  } catch (error) {
    console.error("Error while trying to login user:", error);
    res.status(500).json({ message: "Server error while logging in" });
  }
},
updateAvatar: async (req, res) => {
    try {
      // Multer+Cloudinary return the image URL inside req.file.path
      const avatarUrl = req.file.path; 

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id, 
        { avatar: avatarUrl },   // make sure your schema get `avatar` field
        { new: true }
      ).select("-password"); // remove password from response

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Avatar updated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Avatar update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },



}

module.exports = controller