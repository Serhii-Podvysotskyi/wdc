/**
* AppConfig.js
*
* @description :: Application configurations model
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    name: {
      type: 'alphanumericdashed',
      required: true,
      unique: true,
      notEmpty: true
    },
    pages: {
      type: 'array',
      required: true
    },
    title: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string'
    },
    keywords: {
      type: 'array'
    },
    collaborations: {
      type: 'array'
    },
    isPublished: {
      type: 'boolean',
      required: true
    },
    owner: {
      model: 'User'
    }
  },

  isCollaborator: function (app, user) {
    if (!user) {
      // user is not logged in - therefore not a collaborator
      return false;
    }
    return !_.isUndefined(_.find(app.collaborations,
      function (c) { return c.user.id === user.id; }
    ));
  },

  isOwner: function (app, user) {
    if (!app.owner) {
      // No owner means everybody is an owner
      return true;
    }
    if (!user) {
      // user is not logged in - therefore not an owner
      return false;
    }
    return app.owner.id === user.id;
  }
};

