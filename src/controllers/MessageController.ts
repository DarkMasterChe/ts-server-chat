import express from 'express';
import { MessageModel, DialogModel } from '../schemas';
import socket from 'socket.io';
import { ObjectID } from 'bson';


class MessageController {


    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    index = (req: express.Request, res: express.Response) => {
        const dialogId = req.query.dialog;
        const userId = req.user._id;

        MessageModel.updateMany(
        { "dialog": dialogId, user: {$ne: userId}},
        {"$set": {readed: true}}, 
        (err: any) => {
            if(err) {
                return res.status(500).json({
                    status: 'error',
                    message: err
                });
            }
        });

        

        MessageModel.find({ dialog: dialogId })
            .populate(["dialog", "user"])
            .exec(function(err, messages) {
            if(err) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Message is empty'
                });
            }
            return res.json(messages);
        });
    }
    /*show(req: express.Request, res: express.Response) {
        const id = req.params.id;
        DialogModel.findById(id, (err, user) => {
            if(err) {
                return res.status(404).json({
                    message: 'N'
                });
            }
            res.json(user);
        });
    }


    getMe() {

    }*/

    create = (req: any, res: express.Response) => {
        const userId = req.user._id;

        const postData = {
            text: req.body.text,
            dialog: req.body.dialog_id,
            attachments: req.body.attachments,
            user: userId,
        }
        const message = new MessageModel(postData);

        message
        //.populate("dialog")
        .save()
        .then((obj: any) => {

            obj.populate(["dialog", "user", "attachments"], (err: any, message: any) => {

                if(err) {
                    return res.status(500).json({
                        status: 'error',
                        message: err
                    });
                }


                

                DialogModel.findByIdAndUpdate(
                    { _id: postData.dialog },
                    { lastMessage: message._id },
                    { upsert: true },
                    function(err) {
                        if(err) {
                            return res.status(500).json({
                                status: 'error',
                                message: err
                            });
                        }   
                    })


                res.json(message);


            this.io.emit("SERVER:NEW_MESSAGE", message);

            })
        }).catch((reason: any) => {
            res.json(reason);
        });
        console.log(message.text);
    }

    delete = (req: express.Request, res: express.Response) => {
        const id = req.query.id;
        const userId = req.user._id;

        MessageModel.findById(id, (err, message: any) => {
            if(err || !message) {
                return res.status(404).json({
                    staus: 'error',
                    message: "Message is not found"
                });
            }

            if(message.user.toString() === userId) {
                

                const dialogId = message.dialog;
                message.remove();
 
                MessageModel.findOne({dialog: dialogId}, {}, {sort: {'created_ad': -1} }, (err, lastMessage) => {

                    if(err) {
                        res.status(500).json({
                            staus: 'error',
                            message: err
                        });
                    }

                    DialogModel.findById(dialogId, (err, dialog: any) => {
                        if(err) {
                            res.status(500).json({
                                staus: 'error',
                                message: err
                            });
                        }


                        dialog.lastMessage = lastMessage;
                        dialog.save();
                    })
                })


                return res.json({
                    staus: 'succes',
                    message: "message removed"
                });
            }else {
                return res.status(403).json({
                    staus: 'error',
                    message: "Not promises"
                });
            }

        });

    }
    /*register(req: express.Request, res: express.Response) {
        try {
            req.body.password = bcrypt.hashSync(req.body.password);
            var user = new UserModel(req.body);
            console.log(user.password);
        } catch (error) {
            res.status(500).send(error);
        }
    }*/
}


export default MessageController;