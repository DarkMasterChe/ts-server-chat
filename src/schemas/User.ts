import mongoose, { Schema, Document } from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt';
import { generetePasswordHash } from '../utils';
import differenceInMinutes from 'date-fns/difference_in_minutes';




export interface IUser extends Document {
    email?: string;
    name?: string;
    password?: string;
    confirmed?: boolean;
    confirm_hash?: string;
    last_seen?: Date;
};


const UserSchema = new Schema({
    email: {
        type: String,
        required: 'Email is required',
        validate: [isEmail, 'Invalid email'],
        unique: true
    },
    name: {
        type: String,
        required: 'Name is required'
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirm_hash: String,
    last_seen: {
        type: Date,
        default: new Date
    }
},{
    timestamps: true,

});

UserSchema.virtual('isOnline').get(function(this: any) {
    /*console.log(new Date().toISOString(), 
    this.last_seen, 
    differenceInMinutes(new Date().toISOString(), this.last_seen));*/
    return differenceInMinutes(new Date().toISOString(), this.last_seen) < 5;
});


UserSchema.set("toJSON", {
    virtuals: true
})

UserSchema.pre('save', function(next) {
    const user: IUser = this;

    if (!user.isModified('password')) return next();

    generetePasswordHash(user.password).then(hash => {
        user.password = String(hash);
        generetePasswordHash(+new Date()).then(confirmHash => {
        user.confirm_hash = String(confirmHash);
            next();
        });
    })
    .catch(err => {
        next(err);
    })
});






const UserModel = mongoose.model<IUser>('User', UserSchema );

export default UserModel;