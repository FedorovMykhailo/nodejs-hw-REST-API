import jwt from 'jsonwebtoken'
import { HttpError } from "../helpers/index.js";
import dotenv from 'dotenv/config'

import User from '../models/user.js';

const {JWT_SECRET} = process.env

const authenticate = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        return next(HttpError(401, 'Not authorized'))
    }
    try {
        const { id } =  jwt.verify(token, JWT_SECRET)
        console.log(id);
        const user = await User.findById(id)
        if (!user || !user.token) {
            throw HttpError(401,'Not authorized')
        }
        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401,'Not authorized'))
    }
}

export default authenticate