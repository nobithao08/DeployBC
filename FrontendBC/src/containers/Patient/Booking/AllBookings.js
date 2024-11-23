import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAllBookings, cancelBooking } from '../../../services/userService';
import './AllBookings.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import { toast } from 'react-toastify';

class AllBookings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            loading: false,
            error: '',
            email: '',
        };
    }

    handleSearchBookings = async () => {
        const { email } = this.state;
        if (!email) {
            toast.error("Vui lòng nhập email!");
            return;
        }

        this.setState({ loading: true, bookings: [], error: '' });

        try {
            const res = await getAllBookings();

            if (res && res.errCode === 0) {
                const filteredBookings = res.data.filter(booking => booking.patientData.email.toLowerCase().includes(email.toLowerCase()));
                if (filteredBookings.length > 0) {
                    this.setState({ bookings: filteredBookings });
                } else {
                    this.setState({ error: 'Không tìm thấy lịch hẹn với email này.' });
                    toast.error("Không tìm thấy lịch hẹn.");
                }
            } else {
                this.setState({ error: 'Không thể tải lịch hẹn.' });
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            this.setState({ error: 'Có lỗi xảy ra, vui lòng thử lại.' });
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            this.setState({ loading: false });
        }
    };

    getTimeDisplay = (timeType) => {
        switch (timeType) {
            case 'T1': return '8:00 AM - 9:00 AM';
            case 'T2': return '9:00 AM - 10:00 AM';
            case 'T3': return '10:00 AM - 11:00 AM';
            case 'T4': return '11:00 AM - 12:00 PM';
            case 'T5': return '1:00 PM - 2:00 PM';
            case 'T6': return '2:00 PM - 3:00 PM';
            case 'T7': return '3:00 PM - 4:00 PM';
            case 'T8': return '5:00 PM - 6:00 PM';
            default: return 'Unknown';
        }
    };

    handleCancelBooking = async (id) => {
        const reason = prompt("Vui lòng nhập lý do hủy lịch:");
        if (!reason) {
            toast.error("Lý do hủy không được để trống!");
            return;
        }

        try {

            const res = await cancelBooking({ id, reason });
            if (res && res.errCode === 0) {
                toast.success("Hủy lịch hẹn thành công.");
                this.setState((prevState) => ({
                    bookings: prevState.bookings.map((booking) =>
                        booking.id === id ? { ...booking, statusId: 'S4' } : booking
                    ),
                }));
            } else {
                toast.error("Hủy lịch hẹn thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi hủy lịch hẹn:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };



    render() {
        const { bookings, loading, error, email } = this.state;

        return (
            <div>
                <HomeHeader />

                <div className="container mt-3">
                    <h2>Tất cả lịch hẹn</h2>
                    <div className='all'>
                        <div className="email-input">
                            <input
                                type="email"
                                placeholder="Nhập email đã đăng ký"
                                value={email}
                                onChange={(e) => this.setState({ email: e.target.value })}
                            />
                            <button onClick={this.handleSearchBookings}>
                                Tìm kiếm
                            </button>
                        </div>

                        {error && <p className="error">{error}</p>}

                        {loading ? (
                            <p>Đang tải...</p>
                        ) : (
                            <table id="TableBooking">
                                <thead>
                                    <tr>
                                        <th>Bác sĩ</th>
                                        <th>Ngày hẹn</th>
                                        <th>Thời gian</th>
                                        <th>Lý do</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length > 0 ? (
                                        bookings.map((booking) => (
                                            <tr key={booking.id}>
                                                <td>{booking.doctorInfo.lastName} {booking.doctorInfo.firstName}</td>
                                                <td>{new Date(Number(booking.date)).toLocaleDateString()}</td>
                                                <td>{this.getTimeDisplay(booking.timeType)}</td>
                                                <td>{booking.reason || '_'}</td>  {/* Hiển thị lý do hủy nếu có */}
                                                <td>
                                                    {this.getBookingStatus(booking.statusId)} {/* Trạng thái */}
                                                    {booking.statusId === 'S1' && (  // Hiển thị nút hủy nếu trạng thái là "S1"
                                                        <button
                                                            className="btn-cancel"
                                                            onClick={() => this.handleCancelBooking(booking.id)}
                                                        >
                                                            Hủy lịch
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">Không có lịch hẹn nào để hiển thị.</td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        )}
                    </div>
                </div>
            </div>
        );
    }



    getBookingStatus(statusId) {
        switch (statusId) {
            case 'S1': return 'Chờ xác nhận';
            case 'S2': return 'Đã xác nhận';
            case 'S3': return 'Hoàn thành';
            case 'S4': return 'Đã hủy';
            default: return 'Không xác định';
        }
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

export default withRouter(connect(mapStateToProps)(AllBookings));
