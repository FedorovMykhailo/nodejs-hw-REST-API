import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv/config'
import gravatar from 'gravatar'
import Jimp from "jimp"
import path from "path"
import { nanoid } from 'nanoid'
import fs from 'fs/promises'

import User from "../models/user.js";

import { controllerWrapper } from "../decorators/index.js";

import { HttpError, sendEmail } from "../helpers/index.js";
const { JWT_SECRET, BASE_URL } = process.env

const avatarsPath = path.resolve('public', 'avatars')

// const tempEmail = 'xayok10887@rdluxe.com'

const signup = async (req, res) => {
    const {email,password} = req.body
    const user = await User.findOne({ email })
    if (user) {
        throw HttpError(409,`Email in use`)
    }
    const hashpassword = await bcryptjs.hash(password, 10)
    const verificationToken = nanoid()
    const avatar = gravatar.url(email,{s: '100', r: 'x', d: 'retro'}, true)
    const newUser = await User.create({ ...req.body, password: hashpassword, avatarURL: avatar, verificationToken })
    const verificationEmail = {
        to: email,
        subject: "verification Email",
        html: `<a target="_blank" href = "${BASE_URL}/api//users/verify/${verificationToken}">Click to verify Email!</a>`
    }
    await sendEmail(verificationEmail)
    res.status(201).json({
        avatarURL: newUser.avatarURL,
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

     if (!user.verify) {
        throw HttpError(401,`Email not verify`)
    }
    // console.log(password);
    // console.log(user.password);
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
            avatarURL: user.avatarURL,
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
        avatar,
        email,
        subscription
    })
}

const subscription = async (req, res) => {
    const { _id: id } = req.user
    const updateSubscription = await User.findByIdAndUpdate(id, req.body , { new: true, runValidators: true })
       if (!updateSubscription) {
      throw HttpError(404, 'Not found') 
    }
    res.status(200).json(updateSubscription)
}

const updateAvatars = async (req, res) => {
    const { _id: id } = req.user
    const { path: oldPath} = req.file
    const newFileName = id.toString() + "_avatar.jpg";
    const image = await Jimp.read(oldPath)
    image.resize(250, 250).write(path.join(avatarsPath, newFileName));
    // await fs.rename(oldPath, path.join(avatarsPath,newFileName))
    const avatarURL = path.join("public","avatars",newFileName)
    const updateAvatars = await User.findByIdAndUpdate(id, {avatarURL:avatarURL} , { new: true, runValidators: true })
       if (!updateAvatars) {
      throw HttpError(404, 'Not found') 
    }
    res.status(200).json({avatarURL: updateAvatars.avatarURL})
}

const verifyEmail = async (req, res,) => {
    const { verificationToken } = req.params
    console.log(verificationToken);
    const user = await User.findOne({ verificationToken })
    console.log(user);
    if (!user) {
        throw HttpError(404,`User not found`)
    }
    console.log(user._id);
    await User.findByIdAndUpdate(user._id, {verificationToken:"", verify: true})
    res.status(200).json({message: 'Verification successful'})
}

const resendVerifyEmail = async (req, res,) => {
    const { email } = req.body
    const user = User.findOne({email})
    if (!user) {
        throw HttpError(404,`Email not found`)
    }
    if (!user.verify) {
        throw HttpError(400,`Verification has already been passed`)
    }
    const verificationEmail = {
        to: email,
        subject: "verification Email",
        html: `<a target="_blank" href = "${BASE_URL}/api//users/verify/:${user.verificationToken}">Click to verify Email!</a>`
    }
    await sendEmail(verificationEmail)
    res.status(200).json({message: 'Verification email sent'})
}

export default {
    signin: controllerWrapper(signin),
    signup: controllerWrapper(signup),
    signout: controllerWrapper(signout),
    current: controllerWrapper(current),
    subscription: controllerWrapper(subscription),
    updateAvatars: controllerWrapper(updateAvatars),
    verifyEmail: controllerWrapper(verifyEmail),
    resendVerifyEmail: controllerWrapper(resendVerifyEmail)
}