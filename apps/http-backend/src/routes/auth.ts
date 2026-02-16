import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { authLimiter } from "../rateLimit";

const router: Router = Router();
//to sign up 
router.post("/signup",authLimiter, async(req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    } 
    try {

        //hashing the password 
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);    

        //adding to db 
        const user =await prismaClient.user.create({
        data: {
            email: parsedData.data.username,
            password: hashedPassword,
            name: parsedData.data.name
        }
    })
    
    res.json({
        userId: user.id
    })
    } catch (e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }

})

//to sign in 
router.post("/signin",authLimiter, async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    //find user from db 
    const user = await prismaClient.user.findFirst({
        where:{
            email: parsedData.data.username
        }
    })

    if (!user){
        res.status(403).json({mesage: "unauthorized user"})
        return;
    }

    //compare hased password 
    const ispasswordcorrect = await bcrypt.compare(parsedData.data.password, user.password);
    if (!ispasswordcorrect){
        res.status(403).json({mesage: "unauthorized user"})
        return;
    }
    const token = jwt.sign({
        userId : user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})

export default router;