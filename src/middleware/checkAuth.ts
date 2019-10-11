import { UserModel } from '../schemas';
import express from 'express';
import { verifyJWToken } from '../utils';
import { IUser } from '../schemas/User'; 



export default (req: any, res: any, next: any) => {

    if(req.path === '/user/signin' || req.path === '/user/signup' || req.path === '/user/signup/verify') {
        return next();
    }
        const token = req.headers.token;


        verifyJWToken(token)
        .then((user: any) => {
            req.user = user.data._doc;
            next();
        })
        .catch(err => {
            res.status(403).json({message: "Invalid auth token provided"});
        })

}