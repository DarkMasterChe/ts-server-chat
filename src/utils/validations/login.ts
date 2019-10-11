import { check } from 'express-validator';


export default [check('').isEmail(), check('password').isLength({ min: 5 })];