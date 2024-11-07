import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

const app = express();

app.use(cors(
    {
        credentials: true,
    }
));

app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());

const server = http.createServer(app);

server.listen(3000,()=> {
    console.log("Server is running on port 3000");
});

