import { Router } from "express";
import bcrypt from "bcrypt";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { middleware } from "../middleware";
import { authLimiter } from "../rateLimit";
const router : Router = Router();


//to create a room 
router.post("/room", middleware, async (req, res) => {
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
router.get("/chats/:roomId" , async (req , res) =>{
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
router.get("/room/:slug" , async (req , res) =>{
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
router.post("/room/verify-password",authLimiter, async (req, res) => {
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
router.get("/rooms", middleware, async (req, res) => {
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
router.delete("/room/:slug", middleware, async (req, res) => {
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

export default router;