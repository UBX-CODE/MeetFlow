import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: "http://localhost:5173",
}));

const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.get("/", (_req, res) => {
    res.send("MeetFlow signalong server is running...")
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        
        socket.to(roomId).emit("user-joined", socket.id);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    })
})
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});