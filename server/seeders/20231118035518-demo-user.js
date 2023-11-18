'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin',
        phone_number: '1234567890',
        name: 'admin',
        password: bcrypt.hashSync('admin', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
