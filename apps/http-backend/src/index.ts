import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
 
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

    // Hash password if provided
    let hashedPassword: string | null = null;
    if (parsedData.data.password) {
        hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    }

    const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            adminId: userId,
            password: hashedPassword,
        }
    })

    res.json({
        roomId: room.id
    })
})

//to get all previous chat messages 
// ***** middleware is added extra so send it in header *****
app.get("/chats/:roomId" , async (req , res) =>{
    try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where:{
            roomId: roomId 
        },
        orderBy:{
            id : "desc"
        },
        take: 1000
    });
    res.json({
        messages
    })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

//to get room details
app.get("/room/:slug" , async (req , res) =>{
    const slug  = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where:{
            slug
        }
    })
    if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
    }
    res.json({
        room: {
            id: room.id,
            slug: room.slug,
            createdAt: room.createdAt,
            adminId: room.adminId,
            hasPassword: !!room.password,
        }
    })
})

// Verify room password
app.post("/room/verify-password", async (req, res) => {
    const { slug, password } = req.body;
    if (!slug || !password) {
        res.status(400).json({ message: "Slug and password are required" });
        return;
    }
    const room = await prismaClient.room.findFirst({
        where: { slug }
    });
    if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
    }
    if (!room.password) {
        // Room has no password, allow access
        res.json({ verified: true });
        return;
    }
    const isCorrect = await bcrypt.compare(password, room.password);
    if (!isCorrect) {
        res.status(403).json({ verified: false, message: "Incorrect password" });
        return;
    }
    res.json({ verified: true });
})

//to get all rooms for the logged-in user
app.get("/rooms", middleware, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const rooms = await prismaClient.room.findMany({
            where: {
                adminId: userId
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                slug: true,
                createdAt: true,
            }
        });
        res.json({ rooms });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//to delete a room (only by its admin)
app.delete("/room/:slug", middleware, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const slug = req.params.slug as string;

        const room = await prismaClient.room.findFirst({
            where: { slug: slug, adminId: userId }
        });

        if (!room) {
            res.status(403).json({ message: "Room not found or unauthorized" });
            return;
        }

        // Delete chats first, then the room
        await prismaClient.chat.deleteMany({ where: { roomId: room.id } });
        await prismaClient.room.delete({ where: { id: room.id } });

        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3001, () => {
    console.log("Server started on port 3001");
});
