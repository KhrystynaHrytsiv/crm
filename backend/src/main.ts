import express from "express";
import {apiRouter} from "./routs/apiRouter";
import mongoose from "mongoose";
import {config} from "./configs/config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/', apiRouter);

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
        app.listen(config.PORT, async () =>{
            console.log(`server listen ${config.PORT} port`);
        })
    }catch (e){
        console.log(e);
    }
}
void start();