import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const file = path.resolve('models','contacts.json')

export const listContacts = async () => {
    const  contacts = await fs.readFile(file)
    return JSON.parse(contacts);
  }

export const getContactById = async (contactId) => {
    const contacts = await listContacts();
    const contact = contacts.find(({ id }) => id === contactId)
    return contact || null
}

export const removeContact = async (contactId) => {
    const contacts = await listContacts();
    const contactIndex = contacts.findIndex(({ id }) => id === contactId)
    if (contactIndex === -1) { return null }
    const [contact] = contacts.splice(contactIndex, 1)
    await fs.writeFile(file, JSON.stringify(contacts,null,2))
    return contact
}

export const addContact = async (body) => {
  const contacts = await listContacts();
  const {name, email, phone} = body
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone
    };
    contacts.push(newContact);
    await fs.writeFile(file, JSON.stringify(contacts,null,2))
    return newContact
}

export const updateContact = async (contactId, {name,email,phone}) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(({ id }) => id === contactId)
  if (contactIndex === -1) { return null }
  contacts[contactIndex] = {id:contactId, name, email, phone}
  await fs.writeFile(file, JSON.stringify(contacts, null, 2))
  return contacts[contactIndex]
}

