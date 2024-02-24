import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type:String,
        required : true,
        unique : true,
        validate : {
            validator : function(email){
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/
                return emailRegex.test(email);
            },
            message : "Email Formate is Invalid"
        }
    },
    password : {
        type : String,
        required: true,
        unique : true,
        validate :{
            validator :  function(password){
              return password.length >= 8 
            },
            message : "Password Must be 8ch Long"
        }
    },
    confirmpassword :{
        type : String,
        required : true,
        validate : {
            validator : function(confirmpassword){
                return confirmpassword === this.password
            },
            message : "Password Does not matched"
        }
    }
})


// password hash 
userSchema.pre("save" , async function(next){
    const user = this;
    //  Agar password Enter hi nhi hua hai 
     if(!user.isModified("password")) return next();

     try {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(user.password , salt);
        user.password = hashpassword;
        next()
     } catch (error) {
        console.log(error); 
     }
})

// confirmpassword ko database mai insert  nhi karana hai sirf user se cheack krana hai 
userSchema.pre("save" , function(next){
    if(this.isModified("password"))(
        this.confirmpassword = undefined
    )
    next();
})
export default mongoose.model("Users" , userSchema);