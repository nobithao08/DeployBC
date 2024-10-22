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


module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getAllBookings: getAllBookings
}