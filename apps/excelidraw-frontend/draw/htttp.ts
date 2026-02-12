import axios from "axios";
import { BACKEND_URL } from "@/config";

export async function getexistingShapes(roomId : String){
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages =  res.data.messages;

    const shapes = messages.map((x: {message : string})=> {
        const messageData = JSON.parse(x.message)
        return messageData;
    })
    return shapes;
}
