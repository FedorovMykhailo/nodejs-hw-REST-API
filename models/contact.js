import { Schema, model } from "mongoose";
import Joi from 'joi'

const contactsSchema = new Schema(
    {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    },
    }, {versionKey:false, timestamps:true}
)

export const addContactSchema = Joi.object({
  name: Joi.string().required().messages({"any.required": "missing required name field"}),
  email: Joi.string().email().required().messages({"any.required": "missing required email field"}),
  phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).required().messages({ "any.required": "missing required phone field" }),
  favorite: Joi.boolean()
})

export const addContactFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
    // .message({ "any.required": "missing field favorite" })
})

const Contact = model('contact', contactsSchema)

export default Contact