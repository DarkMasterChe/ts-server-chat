


import express from 'express';
import socket from 'socket.io';



import mongoose from 'mongoose';

import bodyParser from 'body-parser';

import { UserModel } from './schemas';


import { createServer } from 'http';


import dotenv from 'dotenv';

import './core/db';
import  createRoutes from './core/routes';
import  createSocket from './core/socket';

const app = express();
const http = createServer(app);
const io = createSocket(http);

dotenv.config();

//console.log(process.env.JWT_SECRET); //JWT Token Valid 


createRoutes(app, io);

//const io = socket(server);

/*app.post("/create", (req: express.Request, res: express.Response) => {
    const postData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    }
    const user = new UserModel(postData);
    user.save().then((obj: object) => {
        res.json(obj);
    }).catch((reason: any) => {
        res.json(reason);
    });
});*/


http.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
});
app.get('/', (req: express.Request, res: express.Response) => {
    res.send("CONN");
    
})
io.on('connection', (socket: any) => {
    console.log(socket.id);

});
