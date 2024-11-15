import db from "../models/index"; // Đảm bảo import đúng mô hình

let createHistory = async (patientEmail, doctorEmail, bookingId, statusId, description, files) => {
    try {
        // Lấy thông tin bệnh nhân từ email
        const patient = await db.User.findOne({
            where: { email: patientEmail },
            attributes: ['id', 'firstName', 'lastName'],
        });

        if (!patient) {
            throw new Error('Bệnh nhân không tồn tại.');
        }

        // Lấy thông tin bác sĩ từ email
        const doctor = await db.User.findOne({
            where: { email: doctorEmail },
            attributes: ['id', 'firstName', 'lastName'],
        });

        if (!doctor) {
            throw new Error('Bác sĩ không tồn tại.');
        }

        // Lấy thông tin trạng thái từ bảng AllCode
        const status = await db.AllCode.findByPk(statusId);

        if (!status) {
            throw new Error('Trạng thái không tồn tại.');
        }

        // Lấy thông tin cuộc hẹn từ bảng Booking
        const booking = await db.Booking.findByPk(bookingId);

        if (!booking) {
            throw new Error('Cuộc hẹn không tồn tại.');
        }

        // Lưu vào bảng History
        const history = await db.History.create({
            patientId: patient.id,
            doctorId: doctor.id,
            description: description,
            files: files,
            bookingId: booking.id,
            statusId: status.id,
        });

        return {
            errCode: 0,
            errMessage: "Lịch sử khám bệnh đã được tạo thành công.",
            data: history
        };
    } catch (error) {
        console.error("Lỗi khi tạo lịch sử khám bệnh:", error);
        return {
            errCode: 1,
            errMessage: error.message || 'Đã xảy ra lỗi khi tạo lịch sử khám bệnh.'
        };
    }
}

let getHistory = async () => {
    try {
        const histories = await db.History.findAll({
            include: [
                {
                    model: db.User,
                    as: 'patientData',
                    attributes: ['firstName', 'lastName'],
                },
                {
                    model: db.User,
                    as: 'doctorData',
                    attributes: ['firstName', 'lastName'],
                },
                {
                    model: db.AllCode,
                    as: 'statusDetails',
                    attributes: ['valueEn', 'valueVi'],  // Hiển thị giá trị trạng thái (tiếng Anh và tiếng Việt)
                }
            ]
        });

        return {
            errCode: 0,
            errMessage: "Lịch sử khám bệnh đã được lấy thành công.",
            data: histories
        };
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử khám bệnh:", error);
        return {
            errCode: 1,
            errMessage: "Đã xảy ra lỗi khi lấy lịch sử khám bệnh."
        };
    }
}

module.exports = {
    createHistory,
    getHistory
};
