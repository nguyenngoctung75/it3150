const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../config/db')
const sequelize = new Sequelize('db_webtruyen1', 'root', '07052004', {
  host: 'localhost',
  dialect: 'mysql' // hoặc 'postgres', 'sqlite', v.v.
});

const Story = sequelize.define('story', {
    story_id: {
      type: DataTypes.STRING(255),
      primaryKey: true
    },
    name: DataTypes.STRING(255),
    author: {
        type: DataTypes.STRING(255),
        allowNULL: true
    },
    type: DataTypes.ENUM('Tiên Hiệp', 'Trọng Sinh', 'Huyền Huyễn', 'Cổ Đại', 'Đô Thị', 'Hệ Thống', 'Kiếm Hiệp', 'Ngôn Tình', 'Xuyên Không', 'Light Novel', 'Mạt Thế', 'Khác'),
    status: DataTypes.ENUM('Đang ra', 'Hoàn Thành'),
    image: DataTypes.STRING(255),
    description: DataTypes.TEXT,
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
})

module.exports = Story;