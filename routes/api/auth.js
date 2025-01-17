import express from "express";

import authController from "../../controllers/auth-controller.js";
import {isEmptyBody,authenticate,upload} from '../../middlewares/index.js'
import validateBody from '../../decorators/validateBody.js'
import { userSigninSchema, userSignupSchema, userUpdateSubscriptionSchema } from "../../models/user.js";


const authRouter = express.Router();

const userSignupValidate = validateBody(userSignupSchema);
const userSigninValidate = validateBody(userSigninSchema);
const userUpdateSubscriptionValidate = validateBody(userUpdateSubscriptionSchema)

authRouter.post('/register', isEmptyBody, userSignupValidate, authController.signup)
authRouter.post('/login', isEmptyBody, userSigninValidate, authController.signin)
authRouter.post('/logout', authenticate, authController.signout)
authRouter.get('/current', authenticate, authController.current)
authRouter.patch('/users', authenticate, userUpdateSubscriptionValidate, authController.subscription)
authRouter.patch('/avatars', authenticate, upload.single('avatar'), authController.updateAvatars)

export default authRouter