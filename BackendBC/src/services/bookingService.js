import db from "../models/index";

let getStatsByMonth = async () => {
    try {
        let results = await db.Booking.findAll({
            attributes: [
                [db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM TO_TIMESTAMP(CAST("date" AS BIGINT) / 1000.0)')), 'month'],
                [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "statusId" = \'S1\' THEN 1 END')), 'new'],
                [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "statusId" = \'S2\' THEN 1 END')), 'confirmed'],
                [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "statusId" = \'S3\' THEN 1 END')), 'completed'],
                [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "statusId" = \'S4\' THEN 1 END')), 'canceled']
            ],
            group: [db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM TO_TIMESTAMP(CAST("date" AS BIGINT) / 1000.0)'))],
            order: [[db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM TO_TIMESTAMP(CAST("date" AS BIGINT) / 1000.0)')), 'ASC']]
        });
        return results;

    } catch (error) {
        console.log('Error getting stats by month: ', error);
        throw new Error('Error from server');
    }
};

let getDoctorStatsByMonth = async () => {
    try {
        let results = await db.Booking.findAll({
            attributes: [
                [db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM TO_TIMESTAMP(CAST("date" AS BIGINT) / 1000.0)')), 'month'],
                [db.sequelize.fn('COUNT', db.sequelize.literal('CASE WHEN "statusId" = \'S3\' THEN 1 END')), 'completed'] // Chỉ đếm trạng thái S3
            ],
            include: [
                {
                    model: db.User,
                    as: 'doctorInfo',
                    attributes: ['id', 'firstName', 'lastName'],
                    where: { roleId: 'R2' },
                },
            ],
            where: {
                statusId: 'S3'
            },
            group: [
                db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM TO_TIMESTAMP(CAST("date" AS BIGINT) / 1000.0)')),
                'doctorInfo.id'
            ],
            order: [[db.sequelize.fn('EXTRACT', db.sequelize.literal('MONTH FROM TO_TIMESTAMP(CAST("date" AS BIGINT) / 1000.0)')), 'ASC']],
            raw: true
        });

        return results;
    } catch (error) {
        console.error('Error fetching doctor stats:', error);
        throw new Error('Error fetching doctor stats');
    }
};


module.exports = { getStatsByMonth, getDoctorStatsByMonth };
