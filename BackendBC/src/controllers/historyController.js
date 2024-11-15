import historyService from '../services/historyService';

let createHistory = async (req, res) => {
    let { patientEmail, doctorEmail, bookingId, statusId, description, files } = req.body;

    try {
        let newHistory = await historyService.createHistory(patientEmail, doctorEmail, bookingId, statusId, description, files);
        return res.status(201).json({
            message: 'Lịch sử khám bệnh đã được tạo.',
            data: newHistory
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi tạo lịch sử khám bệnh.',
            error: error.message
        });
    }
}

let getHistory = async (req, res) => {
    try {
        let histories = await historyService.getHistory();
        return res.status(200).json({
            message: 'Lấy lịch sử khám bệnh thành công.',
            data: histories
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy lịch sử khám bệnh.',
            error: error.message
        });
    }
}

module.exports = {
    createHistory,
    getHistory
};
