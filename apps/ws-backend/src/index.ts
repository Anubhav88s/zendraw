import { WebSocketServer , WebSocket} from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

// just to start the sever as it is hosted on render 
import http from "http";

const PORT = Number(process.env.PORT) || 8080;
// const wss = new WebSocketServer({ port: PORT });


//just to start the sever as it is hosted on render 
const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200);
        res.end("WS Backend is running!");
        return;
    }
    if (req.url === "/health") {
        res.writeHead(200);
        res.end("ok");
        return;
    }
    res.writeHead(404);
    res.end("not found");
});
const wss = new WebSocketServer({ server });

//creating a variable to store user data 

interface User{
  ws : WebSocket;
  rooms : string[];
  userId : string;
}
//to store all users data
const users : User[] = [];

//verify the token and and returning the user id 

function checkUser(token: string): string | null {
  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;

  } catch (error) {
    return null;
  }


}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms : [],
    ws
  })

  ws.on('message', async function message(data) {
      let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
    }
    //to join the room 
    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws );
      if (!user) {
        return;
      }
      user?.rooms.push(parsedData.roomId)  
    }
    
    //to leave the room 
    if(parsedData.type === "leave_room"){
      const user = users.find(x => x.ws === ws);
      if(!user){
        return;
      }
      user.rooms = user?.rooms.filter( x => x !== parsedData.rooms);
    }

    // to make shape

    if(parsedData.type === "chat"){
      const roomId = parsedData.roomId;
      const message = parsedData.message;
      const parsedMessage = JSON.parse(message);
      

      await prismaClient.chat.create({
        data : {
          roomId: Number(roomId),
          message,
          userId,
          shapeId : parsedMessage.id
        }
      })

      users.forEach (user => {
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type : "chat",
            message: message,
            roomId
            }))
        }
      }) 
    }

    //to delete Shape
    if (parsedData.type === "delete_shape"){
      const roomId = parsedData.roomId;
      const shapeId = parsedData.shapeId;
      
       // 1. Delete from Database using the new field
       await prismaClient.chat.delete({
        where : {
          shapeId : shapeId
        }
       })

       // 2. Broadcast to everyone in the room
       users.forEach(user => {
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type : "delete_shape",
            roomId,
            shapeId
          }))
        }
       })
    }
    
  });

});

// just to start the sever as it is hosted on render 
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

