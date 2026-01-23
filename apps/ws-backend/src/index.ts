import { WebSocketServer , WebSocket} from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

//creating a variable to store user data 

interface User{
  ws : WebSocket;
  rooms : string[];
  userId : string;
}

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
    const ParsedData = JSON.parse(data as unknown as string); // {type : "join-room", roomId : 1}

    //to join the room 
    if (ParsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws );
      if (!user) {
        return;
      }
      user?.rooms.push(ParsedData.roomId)  
    }
    
    //to leave the room 
    if(ParsedData.type === "leave_room"){
      const user = users.find(x => x.ws === ws);
      if(!user){
        return;
      }
      user.rooms = user?.rooms.filter( x => x !== ParsedData.rooms);
    }

    // to chat 

    if(ParsedData.type === "chat"){
      const roomId = ParsedData.roomId;
      const message = ParsedData.message;

      await prismaClient.chat.create({
        data : {
          roomId,
          message,
          userId
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
    
  });

});
