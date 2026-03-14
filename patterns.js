module.exports = {
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  passport: /\b[A-Z]{1,2}\d{6,9}\b/,
  iban: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/,
  israeliId: /\b\d{9}\b/, // Needs context check
  
  keywords: {
    address: ["i live at", "my address is", "street address"],
    dob: ["my birthday is", "born on", "dob", "date of birth"],
    id: ["tz", "teudat zehut", "id number", "teudat zeut"],
    contact: ["my email is", "reach me at", "my phone number is"]
  }
};
