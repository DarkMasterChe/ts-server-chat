import express from 'express';
import { DialogModel, MessageModel } from '../schemas';
import socket from 'socket.io';







class DialogController {

    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }


    index = (req: any, res: express.Response) => {
        console.log(req.user);
        const userId = req.user._id;

        DialogModel.find()
            .or([{ author: userId }, { partner: userId }])
            .populate(["author", "partner"])
            .populate({
                path: "lastMessage",
                populate: {
                    path: "user"
                }
            })
            .exec(function(err, dialogs) {
            if(err) {
                return res.status(404).json({
                    message: 'Dialog is empty'
                });
            }
            return res.json(dialogs);
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

    create = (req: express.Request, res: express.Response) => {
        const postData = {
            author: req.user._id,
            partner: req.body.partner
        }
        const dialog = new DialogModel(postData);

        dialog
        .save()
        .then((dialogObj: any) => {
            const message = new MessageModel({
                text: req.body.text,
                user: req.user._id,
                dialog: dialogObj._id,
            });

            message
            .save()
            .then(() => {
                dialogObj.lastMessage = message._id;
                dialogObj.save().then(() => {
                    res.json(dialogObj);
                this.io.emit("SERVER:DIALOG_CREATED", {
                    ...postData,
                    dialog: dialogObj
                });
                })
            })
            .catch((reason: any) => {
                res.json(reason);
            });

        })
        .catch((err: any) => {
            res.json({
                status: 'error',
                message: err
            });
        });
        console.log(dialog.author);
    }

    delete = (req: express.Request, res: express.Response) => {
        const id = req.params.id;
        DialogModel.findOneAndDelete({ _id: id })
            .then(dialog => {
            if(dialog) {
            console.log(dialog.author);
                    res.json({
                    message: `Dialog removed`
                });
            }
            })
            .catch(err => {
            res.json({
                message: err
            });
        })
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


export default DialogController;