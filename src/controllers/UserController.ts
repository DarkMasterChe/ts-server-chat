import express from 'express';
import { UserModel } from '../schemas';
import { createJWToken } from '../utils';
import { IUser } from '../schemas/User';
import bcrypt from 'bcrypt';
import { validationResult, query } from 'express-validator';
import socket from 'socket.io';


class UserController {

    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    show = (req: express.Request, res: express.Response) => {
        const id = req.params.id;
        UserModel.findById(id, (err, user) => {
            if(err) {
                return res.status(404).json({
                    message: 'N'
                });
            }
            res.json(user);
        });
    }


    getMe = (req: express.Request, res: express.Response, io: any) => {
        const id = req.user._id;
        UserModel.findById(id, (err, user: any) => {
            if(err || !user) {
                return res.status(404).json({
                    message: 'N'
                });
            }
            
            res.json(user);
        });
    }

    findUsers = (req: any, res: express.Response, io: any) => {
        const query: string = req.query.query;
        UserModel.find()
        .or([{ name: new RegExp(query, "i")},
        { email: new RegExp(query, "i")}])
        .then((users: any) => res.json(users))
        .catch((err: any) => {
            return res.status(404).json({
                status: "error",
                message: err
            });
        })
    }

    /*create = (req: express.Request, res: express.Response) => {
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
        console.log(user.password);
    }*/

    delete = (req: express.Request, res: express.Response) => {
        const id = req.params.id;
        UserModel.findOneAndDelete({ _id: id })
            .then(user => {
            if(user) {
            console.log(user.name);
                    res.json({
                    message: `User ${user.name} removed`
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


    create = (req: express.Request, res: express.Response) => {
        const postData = {
          email: req.body.email,
          name: req.body.name,
          password: req.body.password
        };
    
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
    
        const user = new UserModel(postData);
    
        user
          .save()
          .then((obj: any) => {
            res.json(obj);
          })
          .catch((reason: any)=> {
            res.status(500).json({
              status: "error",
              message: reason
            });
            console.log(req.body.password);
          });
      };




    verify = (req: express.Request, res: express.Response) => {
        const hash = req.query.hash;
        console.log(hash);


        if(!hash) {
            return res.status(422).json({ errors: "Invalide hash" });
        }

        UserModel.findOne({ confirm_hash: hash }, (err, user) => {
            if(err || !user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Hash N F'
                });
            }



            user.confirmed = true;
            
            user.save(err => {
                if(err) {
                    return res.status(404).json({
                        status: 'error',
                        message: err
                    });
                }
                res.json({
                    status: 'success',
                    message: 'Valid'
                });
            })
        });
    }

    login = (req: express.Request, res: express.Response) => {
        const postData = {
            email: req.body.email,
            password: req.body.password
        };

        const errors = validationResult(req);

        if(errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() });
        }


        UserModel.findOne({ email: postData.email }, (err, user: any) => {
            if(err || !user) {
                return res.status(404).json({
                    message: 'N'
                });
            }

            if(bcrypt.compareSync(postData.password, user.password)) {
                const token = createJWToken(user);
                res.json({
                    status: "success",
                    token
                })
            } else {
                res.status(403).json({
                    status: "error",
                    message: "incorrect password email"
                })
            }

            

            /*generetePasswordHash(postData.password)
            .then(passwordHash => {
                if(user.password === passwordHash) {
                    const token = createJWToken(user);
                    res.json({
                        status: "success",
                        token
                    })
                }
                else {
                    res.json({
                        status: "error",
                        message: "incorrect password email"
                    })
                }

                    
            }).catch(err => {
                return res.status(404).json({
                    message: 'N'
                });
            })*/


            /*if(user.password === postData.password) {
                const token = createJWToken(user);
                res.json({
                    status: "success",
                    token
                })
            }
            else {
                res.json({
                    status: "error",
                    message: "incorrect password email"
                })
            }*/
        })
    }
}


export default UserController;