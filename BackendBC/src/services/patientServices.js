import { where } from "sequelize";
import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName || !data.selectedGender || !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                let token = uuidv4();

                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                });

                // upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                        phonenumber: data.phonenumber
                    },
                });

                // create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                            birthDate: data.birthDate,
                            reason: data.reason
                        }
                    });

                    await db.Schedule.destroy({
                        where: {
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType
                        }
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient succeed! Time slot removed.'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

let postVerifyBookAppointment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['firstName', 'lastName', 'email', 'phonenumber']
                        },
                        {
                            model: db.User,
                            as: 'doctorInfo',
                            attributes: ['firstName', 'lastName']
                        }
                    ],
                    raw: false,
                    nest: true
                });

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    if (appointment.patientData && appointment.patientData.email && appointment.doctorInfo) {
                        await emailService.sendSimpleEmailSuccess({
                            reciverEmail: appointment.patientData.email,
                            patientName: appointment.patientData.firstName,
                            time: appointment.timeType,
                            doctorName: `${appointment.doctorInfo.firstName} ${appointment.doctorInfo.lastName}`,
                            language: data.language || 'vi'
                        });

                        resolve({
                            errCode: 0,
                            errMessage: "Update the appointment succeeded and email sent!"
                        });
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: "Missing patient or doctor data"
                        });
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or does not exist"
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllBookings = async () => {
    try {
        let bookings = await db.Booking.findAll({
            include: [
                {
                    model: db.User,
                    as: 'patientData',
                    attributes: ['firstName', 'lastName', 'email', 'phonenumber']
                },
                {
                    model: db.User,
                    as: 'doctorInfo',
                    attributes: ['firstName', 'lastName']
                }
            ],
            raw: false,
            nest: true
        });

        // console.log('Bookings fetched:', JSON.stringify(bookings, null, 2));

        return {
            errCode: 0,
            data: bookings
        };
    } catch (error) {
        console.log('Error fetching bookings:', error);
        return {
            errCode: 1,
            errMessage: 'Failed to fetch bookings'
        };
    }
};

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getAllBookings: getAllBookings,
}