import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import { promises } from 'dns';
import router from 'router';  

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());

app.use('/', router()); 

const server = http.createServer(app);

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const MONGO_URI = "mongodb+srv://asm2212:asm2212@cluster0.b88ie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.Promise = promises;

mongoose.connect(MONGO_URI, {})
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log("Connection error:", err));
