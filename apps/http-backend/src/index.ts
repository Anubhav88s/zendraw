import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/room";


const app = express();  
app.use(express.json());
app.use(cors());
app.use(helmet()); 


const PORT = process.env.PORT || 3001;

// Routes
app.use(authRoutes);
app.use(roomRoutes);


// just to start the sever as it is hosted on render 
app.get("/", (req, res) => {
    res.send("HTTP Backend is running!");
});

app.get("/health", (req, res) => {
    res.send("ok");
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
