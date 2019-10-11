import bcrypt from 'bcrypt';
import { IUser } from '../schemas/User';



export default (password: string | number = "") => {

    return new Promise((resolve, reject) => {
    
            bcrypt.hash(password, 10, function(err, hash: string ) {
                if (err) return reject(err);
                
                resolve(hash);
            });
        });
}