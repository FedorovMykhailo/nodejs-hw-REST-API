import { Model, Schema, model } from "mongoose";
import Joi from 'joi'

const userSchema = new Schema(
    {
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: String
    }
)

export const userSignupSchema = Joi.object({
  password: Joi.string().required().messages({"any.required": "missing required password field"}),
  email: Joi.string().email().required().messages({"any.required": "missing required email field"}),
  subscription: Joi.string().valid("starter", "pro", "business"),
})

export const userSigninSchema = Joi.object({
  password: Joi.string().required().messages({"any.required": "missing required password field"}),
  email: Joi.string().email().required().messages({"any.required": "missing required email field"}),
})

export const userUpdateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
})

const User = model('user', userSchema)

export default User