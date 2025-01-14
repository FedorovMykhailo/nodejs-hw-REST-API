import {controllerWrapper} from "../decorators/index.js";
import Contact from "../models/contact.js";
import { HttpError } from "../helpers/index.js";

const getContacts = async (req, res) => {
    const {page=1, limit=10, favorite=null} = req.query
    const { _id: owner } = req.user
    const skip = (page - 1) * limit
    let query = ''
    if (favorite === null) { query = {owner} }
    else {query = {owner,favorite}}
    const contacts = await Contact.find(query, '-createdAt -updatedAt', { skip, limit }).populate("owner", "email subscription -_id")
    //const contacts = await Contact.find({owner, favorite},'',{skip, limit})
    res.json(contacts)
}

const getContactbyID = async (req, res) => {
    const { _id: owner } = req.user
    const id = req.params.contactId
    // const contact = await Contact.findById(id)
    const contact = await Contact.findOne({ _id: id , owner})
    if (!contact) {
      throw HttpError(404, 'Not found') 
    }
    res.json(contact)
}

const addContact = async (req, res) => {
    const {_id: owner} = req.user
    const newContact = await Contact.create({...req.body,owner})
    res.status(201).json(newContact)
}

const deleteContact = async (req, res) => {
    const {_id: owner} = req.user
    const id = req.params.contactId
    const contact = await Contact.findOneAndDelete({ _id: id , owner})
    if (!contact) {
      throw HttpError(404, 'Not found') 
    }
     res.status(200).json({"messsage":'"contact deleted"'})
}

const updateContact = async (req, res, next) => {
    const id = req.params.contactId
    const updatedContact = await Contact.findOneAndUpdate({ _id: id , owner},req.body,{new:true, runValidators:true})
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