import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const singup = async (req, res) => {
  try {
    const userData = new User(req.body);
    const { email } = userData;
    const emailFind = await User.findOne({ email });
    if (emailFind) {
      return res.status(400).json({ msg: "Email Already Exist" });
    }
    await userData.save();
    return res.status(200).json({ msg: "User Register Successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    console.log(userExist, "Userexist");
    if (!userExist) {
      return res.status(400).json({ msg: "User not exist" });
    }

    const isValidPassword = await bcrypt.compare(password, userExist.password);
    console.log(isValidPassword, "isvalidpassword");

    const existToken = req.cookies.token;
    if (existToken) {
      return res.status(400).json({ msg: "Already Exist" });
    }

    //Generate Token
    const token = jwt.sign({ userId: userExist._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    console.log(token, "token");
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({ msg: "Login successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const logout = async (req, res) => {
  try {
    const existToken = req.cookies.token;
    if (!existToken) {
      return res.status(400).json({ msg: "Login required" });
    }
    res.clearCookie("token");
    res.status(200).json({ msg: " Logout Successfullly" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};


export const update = async (req , res)=>{
  try {
    
    const id = req.params.id;
    const userExist = User.findOne({_id:id});
    if(!userExist){
      res.status(400).json({msg:"User not Exist"});
    }

    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(req.body.password , salt);
      req.body.password = hashpassword;
    }

    const updateUser = await User.findByIdAndUpdate(id , req.body, {new: true});
    res.status(200).json(updateUser);
    

  } catch (error) {
    res.status(500).json({error:error})
  }
}