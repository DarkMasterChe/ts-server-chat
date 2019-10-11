import { check } from 'express-validator';


export default [
    check("email").isEmail(), 
    check("name").isLength({ min: 5 }),
    check("password").isLength({ min: 5 })
];