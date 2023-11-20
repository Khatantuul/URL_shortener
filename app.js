import express from 'express';
import {config} from 'dotenv';
import mongoose from "mongoose";
import route from './routes/index.js';


const app = express();
config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Connected to database");
})
.catch(err=>console.log(err))

route(app);


export default app;