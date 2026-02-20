import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/room";

dotenv.config();

const app = express();  
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
})); 
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map(url => url.trim());

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
       if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors({
    origin: allowedOrigins,
    credentials: true,
}));


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
