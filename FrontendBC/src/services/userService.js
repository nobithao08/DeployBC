import axios from '../axios';
const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUsers = (inputId) => {
    //template string
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

const createNewUserService = (data) => {
    console.log('check data from service : ', data)
    return axios.post('/api/create-new-user', data)
}

const deteleUserService = (userId) => {
    // return axios.delete('/api/delete-user', stringt)
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`)
}

const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-infor-doctors', data)
}

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data)
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}

const postVerifyBookAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data)
}

const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data)
}

const getAllSpecialty = () => {
    return axios.get(`/api/get-specialty`)
}

const createNewHandbook = (data) => {
    return axios.post('/api/create-new-handbook', data)
}
const getAllHandbook = () => {
    return axios.get(`/api/get-handbook`)
}

const getAllDetailHandbookById = (data) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${data.id}`)
}


const getAllDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}

const getAllDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
}

const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data)
}

const getAllClinic = () => {
    return axios.get(`/api/get-clinic`)
}

const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data)
}

const getAllBookings = () => {
    return axios.get(`/api/get-all-bookings`);
}

const searchSpecialty = (query) => {
    return axios.get('/api/get-specialty/search', {
        params: { query },
    });
};

const getStatsByMonth = () => {
    return axios.get('/api/stats-by-month');
};

const getDoctorStatsByMonth = () => {
    return axios.get('/api/stats-doctor-by-month');
};

const getUserByEmail = (email) => {
    return axios.get(`/api/get-user-by-email?email=${email}`);
};

const cancelBooking = async (data) => {
    return await axios.post('/api/cancel-booking', data);
};

const rescheduleBooking = async (data) => {
    return await axios.post('/api/reschedule-booking', data);
};


export {
    handleLoginApi, getAllUsers,
    createNewUserService, deteleUserService,
    editUserService, getAllCodeService, getTopDoctorHomeService,
    getAllDoctors, saveDetailDoctorService,
    getDetailInforDoctor, saveBulkScheduleDoctor,
    getScheduleDoctorByDate, getExtraInforDoctorById,
    getProfileDoctorById, postPatientBookAppointment,
    postVerifyBookAppointment, createNewSpecialty,
    getAllSpecialty, getAllDetailSpecialtyById,
    createNewClinic,
    getAllClinic, getAllDetailClinicById,
    createNewHandbook,
    getAllHandbook, getAllDetailHandbookById,
    getAllPatientForDoctor, postSendRemedy,
    getAllBookings, searchSpecialty,
    getStatsByMonth, getDoctorStatsByMonth, getUserByEmail,
    cancelBooking, rescheduleBooking
}