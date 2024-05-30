const { Op } = require("sequelize");
const Contact = require("../models/contact");

async function findOrCreateContact(email, phoneNumber) {
  const contacts = await Contact.findAll({
    where: {
      [Op.or]: [{ email: email }, { phoneNumber: phoneNumber }],
    },
  });

  if (contacts.length === 0) {
    const newContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: "primary",
    });

    return {
      primaryContactId: newContact.id,
      emails: [newContact.email],
      phoneNumbers: [newContact.phoneNumber],
      secondaryContactIds: [],
    };
  }

  let primaryContact = contacts.find(
    (contact) => contact.linkPrecedence === "primary"
  );
  let secondaryContacts = contacts.filter(
    (contact) => contact.linkPrecedence === "secondary"
  );

  if (!primaryContact) {
    primaryContact = contacts[0];
    await primaryContact.update({ linkPrecedence: "primary" });
  }

  const newSecondaryContact = await Contact.create({
    email,
    phoneNumber,
    linkedId: primaryContact.id,
    linkPrecedence: "secondary",
  });

  const emails = new Set(
    contacts.map((contact) => contact.email).filter(Boolean)
  );
  const phoneNumbers = new Set(
    contacts.map((contact) => contact.phoneNumber).filter(Boolean)
  );

  if (email) emails.add(email);
  if (phoneNumber) phoneNumbers.add(phoneNumber);

  return {
    primaryContactId: primaryContact.id,
    emails: Array.from(emails),
    phoneNumbers: Array.from(phoneNumbers),
    secondaryContactIds: secondaryContacts
      .map((contact) => contact.id)
      .concat(newSecondaryContact.id),
  };
}

module.exports = {
  findOrCreateContact,
};
