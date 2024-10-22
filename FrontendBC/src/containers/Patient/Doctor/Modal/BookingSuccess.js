import React from 'react';
import { Link } from 'react-router-dom';
import './BookingSuccess.scss';
import HomeHeader from '../../../HomePage/HomeHeader';

const BookingSuccess = () => {
    return (
        <>  <HomeHeader
            isShowBanner={false}
        />
            <div className="booking-success-container">
                <h1>Đặt lịch khám thành công!</h1>
                <p>Cảm ơn bạn đã đặt lịch khám từ Booking Care. Hệ thống đã ghi nhận lịch hẹn. Nhân viên hỗ trợ sẽ gọi điện thoại xác nhận trong thời gian 24h kể từ khi đặt lịch.</p>
                <p>Cần hỗ trợ vui lòng liên hệ hotline: 1900 00 11 22</p>
                <Link to="/home">Quay về trang chủ</Link>

            </div>

        </>
    );
};

export default BookingSuccess;
