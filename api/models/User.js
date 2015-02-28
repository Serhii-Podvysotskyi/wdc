var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    // username  : { type: 'string', unique: true }, // Do we need username?
    email: { type: 'email',  unique: true, required: true },
    name: {type: 'string', required: true},
    passports : { collection: 'Passport', via: 'user' }
  }
};

module.exports = User;