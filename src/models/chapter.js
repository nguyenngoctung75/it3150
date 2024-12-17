const { DataTypes } = require('sequelize');
const sequelize = require('../config/db')

const chapter = sequelize.define('story', {
    chapter_id: {
      type: DataTypes.STRING(255),
      primaryKey: true
    },
    story_id: {
        type: DataTypes.STRING(255),
        references: {
            model: 'stories',
            key: 'story_id'
        },
        allowNull: false
    },
    content: DataTypes.TEXT,
    num_chap: DataTypes.INT,
    name_chap: DataTypes.STRING(255),
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
})

module.exports = story;