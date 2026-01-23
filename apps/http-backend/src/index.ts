import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());
 
//to sign up 
app.post("/signup", async(req, res) => {

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
app.post("/signin", async (req, res) => {
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

//to create a room 
app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    //@ts-ignore
    const userId =req.userId ;
    const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            adminId: userId,
        }
    })

    res.json({
        roomId: room.id
    })
})

//to get all previous chat messages 
// ***** middleware is added extra so send it in header *****
app.get("/chats/:roomId" , middleware, async (req , res) =>{

    const roomId = Number(req.params.roomId);
    const message = await prismaClient.chat.findMany({
        where:{
            roomId: roomId 
        },
        orderBy:{
            id : "desc"
        },
        take: 50
    });
    res.json({
        message
    })
})

app.listen(3001, () => {
    console.log("Server started on port 3001");
});
