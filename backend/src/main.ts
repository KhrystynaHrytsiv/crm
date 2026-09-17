import express, {NextFunction, Request, Response} from "express";
import {apiRouter} from "./routs/apiRouter";
import mongoose from "mongoose";
import {config} from "./configs/config";
import dns from "node:dns";
import cors from "cors";
import {apiError} from "./error/apiError";
import {seed} from "./seed/adminSeed";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({ origin: ["http://localhost:3000"] }));
app.use('/', apiRouter);
app.use((err: apiError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message ?? "Something went wrong";
    res.status(status).json({ status, message });
});
process.on("uncaughtException", (err) => {
    console.log("uncaughtException", err);
    process.exit(1);
});


const connection = async () =>{
    let dbCon =false;
    while (!dbCon) {
        try {
            await mongoose.connect(config.MONGO_URI);
            dbCon = true;
            console.log("Connection available");
        } catch (e) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            console.log(e);
        }
    }
}

const start = async () =>{
    try{
        await connection();
        await seed();
        app.listen(config.PORT, async () =>{
            console.log(`server listen ${config.PORT} port`);
        })
    }catch (e){
        console.log(e);
    }
}
void start();