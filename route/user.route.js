import express from "express"
import { login, logout, singup, update } from "../controler/user.controler.js";
import { authmiddleware } from "../middleware/auth.middlewara.js";

const route = express.Router();

route.post('/singup', singup);
route.post('/login', login)
route.get('/logout' , logout)
route.put('/update/:id',authmiddleware, update)


export default route