import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv/config'

import User from "../models/user.js";

import { controllerWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";
const {JWT_SECRET} = process.env

const signup = async (req, res) => {
    const {email,password} = req.body
    const user = await User.findOne({ email })
    if (user) {
        throw HttpError(409,`Email in use`)
    }
    const hashpassword = await bcryptjs.hash(password,10)
    const newUser = await User.create({ ...req.body, password: hashpassword })
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription
    })
}

const signin = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw HttpError(401,`Email or password is wrong`)
    }
    console.log(password);
    console.log(user.password);
    const passwordCompare = await bcryptjs.compare(password, user.password)
    console.log(passwordCompare);
    if (!passwordCompare) {
        throw HttpError(401,`Email or password is wrong`)
    }
    const payload = {
        id: user._id
    }
    console.log(JWT_SECRET);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' })
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
        "user": {
            email: user.email,
            subscription: user.subscription
        }
    })
}

const signout = async (req, res) => {
    const { _id:id } = req.user
    await User.findByIdAndUpdate(id,{token:""})
    res.status(204).json({message: 'No Content'})
}

const current = async (req, res) => {
    const {email, subscription} = req.user
    res.json({
        email,
        subscription
    })
}

const subscription = async (req, res, next) => {
    
    const { _id: id } = req.user
    const subscriptionType = req.body.subscription
    const updateSubscription = await User.findByIdAndUpdate(id,  req.body , { new: true, runValidators: true })
       if (!updateSubscription) {
      throw HttpError(404, 'Not found') 
    }
    res.status(200).json(updateSubscription)
    
    
    // const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    //  if (!updatedContact) {
    //   throw HttpError(404, 'Not found') 
    // }
    // res.status(200).json(updatedContact)
}

export default {
    signin: controllerWrapper(signin),
    signup: controllerWrapper(signup),
    signout: controllerWrapper(signout),
    current: controllerWrapper(current),
    subscription: controllerWrapper(subscription)
}