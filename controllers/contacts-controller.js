import {controllerWrapper} from "../decorators/index.js";
import Contact from "../models/contact.js";
import { HttpError } from "../helpers/index.js";

const getContacts = async (req, res) => {
    const contacts = await Contact.find()
    res.json(contacts)
}

const getContactbyID = async (req, res) => {
        const id = req.params.contactId
    const contact = await Contact.findById(id)
    if (!contact) {
      throw HttpError(404, 'Not found') 
    }
    res.json(contact)
}

const addContact = async (req, res) => {
    const newContact = await Contact.create(req.body)
    res.status(201).json(newContact)
}

const deleteContact = async (req, res) => {
    const id = req.params.contactId
    const contact = await Contact.findByIdAndDelete(id)
    if (!contact) {
      throw HttpError(404, 'Not found') 
    }
     res.status(200).json({"messsage":'"contact deleted"'})
}

const updateContact = async (req, res, next) => {
    const id = req.params.contactId
    const updatedContact = await Contact.findByIdAndUpdate(id,req.body,{new:true, runValidators:true})
    res.status(201).json(updatedContact)
}

const updateContactFavorite =async (req, res, next) => {
    const id = req.params.contactId
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
     if (!updatedContact) {
      throw HttpError(404, 'Not found') 
    }
    res.status(200).json(updatedContact)
}

export default {
    getContacts: controllerWrapper(getContacts),
    getContactbyID: controllerWrapper(getContactbyID),
    addContact: controllerWrapper(addContact),
    deleteContact: controllerWrapper(deleteContact),
    updateContact: controllerWrapper(updateContact),
    updateContactFavorite: controllerWrapper(updateContactFavorite)
}