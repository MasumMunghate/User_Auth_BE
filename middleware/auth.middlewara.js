import jwt  from "jsonwebtoken";

export const authmiddleware = async (req, res,next)=>{
    const token = req.cookies.token;
    const id = req.params.id;

    if(!token){
        return res.status(400).json({msg : "Login First"});
    }
    try {
        const decodedToken = jwt.verify(token , process.env.SECRET_KEY);
        req.userId = decodedToken.userId;

        if(id != decodedToken.userId){
            return res.status(400).json({msg :"Access Denied"})
        }
        next()
    } catch (error) {
        res.status(500).json({error:error})
    
    }
} 