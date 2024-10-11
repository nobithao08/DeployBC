'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Chuyển đổi kiểu dữ liệu cột "image" sang BYTEA
        await queryInterface.sequelize.query('ALTER TABLE "Users" ALTER COLUMN "image" TYPE BYTEA USING "image"::bytea');
    },

    down: async (queryInterface, Sequelize) => {
        // Quay lại kiểu dữ liệu ban đầu, ví dụ là VARCHAR
        await queryInterface.sequelize.query('ALTER TABLE "Users" ALTER COLUMN "image" TYPE VARCHAR USING "image"::varchar');
    }
};
