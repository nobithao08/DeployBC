import React, { Component } from 'react';
import { connect } from "react-redux";
import { getAllBookings, postVerifyBookAppointment, cancelBooking } from "../../../services/userService";
import './ManageAppointment.scss';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

class AdminBookingManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newBookings: [],
            confirmedBookings: [],
            completedBookings: [],
            canceledBookings: [],
            loading: true,
            error: null,
            activeTab: 'new',
            currentPage: 1,
            bookingsPerPage: 5,
        };
    }

    async componentDidMount() {
        try {
            let res = await getAllBookings();
            if (res && res.errCode === 0) {
                const bookings = res.data;

                const newBookings = bookings.filter(b => b.statusId === 'S1');
                const confirmedBookings = bookings.filter(b => b.statusId === 'S2');
                const completedBookings = bookings.filter(b => b.statusId === 'S3');
                const canceledBookings = bookings.filter(b => b.statusId === 'S4');

                this.setState({
                    newBookings,
                    confirmedBookings,
                    completedBookings,
                    canceledBookings,
                    loading: false,
                });
            } else {
                this.setState({ error: res.errMessage, loading: false });
            }
        } catch (error) {
            this.setState({ error: 'Failed to fetch bookings', loading: false });
        }
    }

    handleVerifyBooking = async (token, doctorId) => {
        try {
            let res = await postVerifyBookAppointment({ token, doctorId });
            if (res && res.errCode === 0) {
                toast.success('Xác nhận lịch hẹn thành công!');

                const verifiedBooking = this.state.newBookings.find(booking => booking.token === token);

                this.setState(prevState => ({
                    newBookings: prevState.newBookings.filter(booking => booking.token !== token),
                    confirmedBookings: [...prevState.confirmedBookings, { ...verifiedBooking, statusId: 'S2' }]
                }));
            } else {
                toast.error('Vui lòng điền đầy đủ thông tin!');
            }
        } catch (error) {
            console.error('Error verifying booking:', error);
            toast.error('Có lỗi xảy ra trong quá trình xác nhận lịch hẹn.');
        }
    };

    handleCompleteBooking = (bookingId) => {
        this.setState(prevState => ({
            confirmedBookings: prevState.confirmedBookings.map(booking =>
                booking.id === bookingId ? { ...booking, statusId: 'S3' } : booking
            ),
            completedBookings: [...prevState.completedBookings, ...prevState.confirmedBookings.filter(booking => booking.id === bookingId)]
        }));
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
                    newBookings: prevState.newBookings.filter(booking => booking.id !== id),
                    canceledBookings: [
                        ...prevState.canceledBookings,
                        { ...prevState.newBookings.find(booking => booking.id === id), statusId: 'S4' }
                    ]
                }));
            } else {
                toast.error("Hủy lịch hẹn thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi hủy lịch hẹn:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
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

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab, currentPage: 1 });
    };

    handleNextPage = () => {
        this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
    };

    handlePreviousPage = () => {
        this.setState(prevState => ({ currentPage: prevState.currentPage - 1 }));
    };

    render() {
        const { loading, error, activeTab, currentPage, bookingsPerPage } = this.state;
        const { newBookings, confirmedBookings, completedBookings, canceledBookings } = this.state;

        if (loading) return <div>Loading bookings...</div>;
        if (error) return <div>Error: {error}</div>;

        const totalBookings = activeTab === 'new' ? newBookings.length :
            activeTab === 'confirmed' ? confirmedBookings.length :
                activeTab === 'completed' ? completedBookings.length :
                    canceledBookings.length;

        const totalPages = Math.ceil(totalBookings / bookingsPerPage);
        const indexOfLastBooking = currentPage * bookingsPerPage;
        const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;

        const currentBookings = activeTab === 'new' ? newBookings.slice(indexOfFirstBooking, indexOfLastBooking) :
            activeTab === 'confirmed' ? confirmedBookings.slice(indexOfFirstBooking, indexOfLastBooking) :
                activeTab === 'completed' ? completedBookings.slice(indexOfFirstBooking, indexOfLastBooking) :
                    canceledBookings.slice(indexOfFirstBooking, indexOfLastBooking);

        const renderTable = (bookings, title, showActions = false) => (
            <div className=" table-container">
                <h3>{title}</h3>
                <table>
                    <thead>
                        <tr>
                            <th><FormattedMessage id="manage-appointment.patientName" /></th>
                            <th><FormattedMessage id="manage-appointment.email" /></th>
                            <th><FormattedMessage id="manage-appointment.phone" /></th>
                            <th><FormattedMessage id="manage-appointment.reason" /></th>
                            <th><FormattedMessage id="manage-appointment.doctor" /></th>
                            <th><FormattedMessage id="manage-appointment.date" /></th>
                            <th><FormattedMessage id="manage-appointment.time" /></th>
                            {showActions && <th><FormattedMessage id="manage-appointment.actions" /></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.patientData.firstName} {booking.patientData.lastName || ''}</td>
                                <td>{booking.patientData.email}</td>
                                <td>{booking.patientData.phonenumber}</td>
                                <td>{booking.reason}</td>
                                <td>{booking.doctorInfo.lastName} {booking.doctorInfo.firstName || ''}</td>
                                <td>{new Date(Number(booking.date)).toLocaleDateString()}</td>
                                <td>{this.getTimeDisplay(booking.timeType)}</td>
                                {showActions && (
                                    <td>
                                        <button className="btn-confirm" onClick={() => this.handleVerifyBooking(booking.token, booking.doctorId)}>
                                            <i className="fas fa-check"></i>
                                        </button>
                                        <button className="btn-cancel" onClick={() => this.handleCancelBooking(booking.id)}>
                                            <i className="fas fa-times"></i>
                                        </button>

                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

        return (
            <div className="admin-booking-management main-content">
                <div className="manage-appointment-title">
                    <FormattedMessage id="manage-appointment.title" />
                </div>
                <div className='all'>
                    <div className="tab-container">
                        <button onClick={() => this.handleTabChange('new')}>
                            <FormattedMessage id="manage-appointment.new" />
                        </button>
                        <button onClick={() => this.handleTabChange('confirmed')}>
                            <FormattedMessage id="manage-appointment.confirmed" />
                        </button>
                        <button onClick={() => this.handleTabChange('completed')}>
                            <FormattedMessage id="manage-appointment.completed" />
                        </button>
                        <button onClick={() => this.handleTabChange('canceled')}>
                            <FormattedMessage id="manage-appointment.canceled" />
                        </button>
                    </div>

                    {renderTable(currentBookings, `Danh sách ${activeTab}`, true)}

                    <div className="pagination">
                        <button disabled={currentPage === 1} onClick={this.handlePreviousPage}>Prev</button>
                        <span>{currentPage} / {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={this.handleNextPage}>Next</button>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    language: state.app.language,
});

export default connect(mapStateToProps)(AdminBookingManagement);
