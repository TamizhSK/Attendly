const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');  // Assuming you have a User model

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// Establish the relationship
User.hasMany(Note, { 
    foreignKey: {
      name: 'userId',
      type: DataTypes.UUID
    }
  });
  Note.belongsTo(User, { 
    foreignKey: {
      name: 'userId',
      type: DataTypes.UUID
    }
  });

module.exports = Note;