require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Booking Care" <btpthaovvk@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch khám bệnh",
        html: getBodyHTMLEmail(dataSend),
    });

}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care.</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

           <div><b> Trạng thái lịch hẹn: Lịch hẹn đang chờ xác nhận</b></div>
           <p>Hệ thống Booking Care sẽ tự động gửi email thông báo khi lịch hẹn được xác nhận hoàn tất. Xin vui lòng chờ!</p>
        <p> Booking Care xin chân thành cảm ơn!</p>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
              <h3>Hi ${dataSend.patientName}!</h3>
        <p>You are receiving this email because you have booked an appointment online on Booking Care.</p>
        <p>Appointment information:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

           <div><b>Appointment Status: Appointment pending confirmation/b></div>
           <p>Booking Care system will automatically send notification email when appointment is confirmed. Please wait.</p>
        <p>Booking Care sincerely thanks!</p>
        `
    }

    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care thành công.</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>

        <div> Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on Booking Care.</p>
        <p>Prescription/invoice information is sent in the attached file.</p>
        <div> Sincerely thank!</div>
        `
    }

    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            let info = await transporter.sendMail({
                from: '"Booking Care" <btpthaovvk@gmail.com>',
                to: dataSend.email,
                subject: "Kết quả đặt lịch khám bệnh",
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    },
                ],

            });

            resolve(true)

        } catch (e) {
            reject(e)
        }

    })
}

let sendSimpleEmailSuccess = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Booking Care" <btpthaovvk@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch khám bệnh",
        html: getBodyHTMLEmailSuccess(dataSend),
    });

}

let getBodyHTMLEmailSuccess = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care.</p>

           <div>Hệ thống Booking Care gửi email xin thông báo: <b> Lịch hẹn đăng ký thành công</b></div>

           <p>Hệ thống Booking Care cảm ơn bạn đã tin tưởng và sử dụng</p>
        <p> Xin chân thành cảm ơn!</p>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
              <h3>Hi ${dataSend.patientName}!</h3>
        <p>You are receiving this email because you have booked an appointment online on Booking Care.</p>
     <div>Booking Care system sends email to notify: <b> Successful appointment registration</b></div>
           <p> Appointment Status: Appointment pending confirmation</p>
           <p>Booking Care system thanks you for your trust and use.</p>
        <p> Sincerely thank!</p>
        `
    }

    return result;
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
    sendSimpleEmailSuccess: sendSimpleEmailSuccess
}