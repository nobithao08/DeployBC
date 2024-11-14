import bookingService from '../services/bookingService';

let getStatsByMonth = async (req, res) => {
    try {
        let data = await bookingService.getStatsByMonth();
        return res.status(200).json(data);
    } catch (e) {
        console.log('Get stats by month error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

let getDoctorStatsByMonth = async (req, res) => {
    try {
        let stats = await bookingService.getDoctorStatsByMonth();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching doctor stats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getStatsByMonth, getDoctorStatsByMonth };
