import { UserModel } from '../schemas';
import express from 'express';
import { userInfo } from 'os';


export default (
    req: express.Request, 
    __: express.Response, 
    next: express.NextFunction
    ) => {
    if(req.user) {
        UserModel.findOneAndUpdate({ _id: req.user._id}, { 
            last_seen: new Date() 
        }, 
        { 
            new: true 
        }, () => {}
        )
    }
    
    /*UserModel.updateOne(
        { _id: '5d25b097e2346f49ec399271'},
        { $set: { 
            last_seen: new Date() 
        } },
        () => {}
        );*/
    next();
}