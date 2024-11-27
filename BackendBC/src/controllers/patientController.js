import patientService from '../services/patientServices';

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(
            infor
        )

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(
            infor
        )

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllBookings = async (req, res) => {
    try {
        let result = await patientService.getAllBookings();
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching bookings:', error); // In ra lỗi
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Error from server: ' + error.message,
        });
    }
};

let handleGetUserByEmail = async (req, res) => {
    try {
        let email = req.query.email;

        if (!email) {
            return res.status(400).json({
                errCode: 1,
                message: 'Missing required parameter: email'
            });
        }

        let response = await patientService.getUserByEmail(email);
        return res.status(200).json(response);

    } catch (error) {
        console.error('Error in controller:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
};

let cancelBooking = async (req, res) => {
    try {
        let { id, reason } = req.body;

        if (!id || !reason) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Thiếu thông tin cần thiết.',
            });
        }

        let result = await patientService.cancelBooking(id, reason);

        return res.status(result.errCode === 0 ? 200 : 500).json(result);
    } catch (error) {
        console.error('Lỗi trong cancelBooking:', error);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ server.',
        });
    }
};

const rescheduleBooking = async (req, res) => {
    try {
        const { id, date, timeType } = req.body;

        const validDate = new Date(date);

        const result = await patientService.rescheduleBookingService(id, validDate, timeType);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Dời lịch thành công',
                data: {
                    id,
                    date,
                    timeType,
                },
            });
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Lỗi trong controller rescheduleBooking:', error);
        return res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại sau.' });
    }
};


module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getAllBookings: getAllBookings,
    handleGetUserByEmail: handleGetUserByEmail,
    cancelBooking, rescheduleBooking
}