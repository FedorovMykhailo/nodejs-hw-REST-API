import express from 'express'

import contactsController from '../../controllers/contacts-controller.js'
import {isEmptyBody, isValidId} from '../../middlewares/index.js'
import { addContactSchema, addContactFavoriteSchema } from '../../models/contact.js'
import validateBody from '../../decorators/validateBody.js'

const contactsRouter = express.Router()

//db_pass = 'EdZ7CPVPfsWcLuHL'

const contactValidate = validateBody(addContactSchema)
const contactFavoriteValidate = validateBody(addContactFavoriteSchema)

contactsRouter.get('/', contactsController.getContacts)

contactsRouter.get('/:contactId', isValidId, contactsController.getContactbyID)

contactsRouter.post('/',isEmptyBody, contactValidate, contactsController.addContact)

contactsRouter.delete('/:contactId',isValidId,contactsController.deleteContact)

contactsRouter.put('/:contactId', isValidId, isEmptyBody, contactValidate, contactsController.updateContact)

contactsRouter.patch('/:contactId/favorite',isValidId, isEmptyBody, contactFavoriteValidate, contactsController.updateContactFavorite)

export default contactsRouter
