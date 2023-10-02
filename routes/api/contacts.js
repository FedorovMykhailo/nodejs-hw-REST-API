import express from 'express'
import { listContacts, getContactById, addContact, removeContact, updateContact } from '../../models/contacts.js'
import { HttpError } from '../../helpers/index.js'
import Joi from 'joi'

const contactsRouter = express.Router()

const addContactSchema = Joi.object({
  name: Joi.string().required().messages({"any.required": "missing required name field"}),
  email: Joi.string().required().messages({"any.required": "missing required email field"}),
  phone: Joi.string().required().messages({"any.required": "missing required phone field"})
})
 
contactsRouter.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts()
    res.json(contacts)
  } catch (error) {
     next(error)
  }
})

contactsRouter.get('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId
    const contact = await getContactById(id)
    if (!contact) {
      throw HttpError(404, 'Not found') 
    }
    res.json(contact)
  } catch (error) {
    next(error)
  }
})

contactsRouter.post('/', async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, 'missing fields')
    }
    const { error } = addContactSchema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message)
    }
    const newContact = await addContact(req.body)
    res.status(201).json(newContact)
  } catch (error) {
    next(error)
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
   try {
    const id = req.params.contactId
    const contact = await removeContact(id)
    if (!contact) {
      throw HttpError(404, 'Not found') 
    }
     res.status(200).json({"messsage":'"contact deleted"'})
  } catch (error) {
    next(error)
  }
})

contactsRouter.put('/:contactId', async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, 'missing fields')
    }
    const id = req.params.contactId
    const { error } = addContactSchema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message)
    }
    const updatedContact = await updateContact(id,req.body)
    res.status(201).json(updatedContact)
  } catch (error) {
    next(error)
  }
})

export default contactsRouter
