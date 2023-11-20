'use strict';

const { seedFromCsv } = require('../utils/seeder');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'Products';

    await queryInterface.bulkDelete(tableName, null, {});

    await seedFromCsv(queryInterface, tableName);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
