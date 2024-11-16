import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
// import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { getUserByEmail, postPatientBookAppointment } from '../../../../services/userService';
import { toast } from "react-toastify";
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';
import { withRouter } from 'react-router-dom';

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phonenumber: '',
            email: '',
            address: '',
            reason: '',
            birthDate: '',
            selectedGender: '',
            doctorId: '',
            genders: '',
            timeType: '',
            isShowLoading: false,

            isEmailModalOpen: false,
            tempEmail: ''
        }
    }

    async componentDidMount() {
        this.props.getGenders();


    }
    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object)

                return object;
            })
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }


    handleOnchangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
        if (id === 'birthDate') {
            valueInput = valueInput ? parseInt(valueInput, 10) : '';
        }

        this.setState({
            [id]: valueInput
        });
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');

            return `${time} - ${date}`

        }
        return ''
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`

            return name;
        }
        return ''
    }


    handleConfirmBooking = async () => {
        this.setState({
            isShowLoading: true
        });

        let date = this.state.birthDate;

        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);

        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phonenumber: this.state.phonenumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthDate: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        });

        this.setState({
            isShowLoading: false
        });

        if (res && res.errCode === 0) {
            toast.success('Đặt lịch hẹn thành công!');
            if (this.props.history) {
                this.props.history.push('/booking-success');
            }
            this.setState({
                fullName: '',
                phonenumber: '',
                email: '',
                address: '',
                reason: '',
                birthDate: '',
                selectedGender: '',
                doctorId: '',
                timeType: ''
            });
            this.props.closeBookingClose();
        } else {
            toast.error('Vui lòng điền đầy đủ thông tin!');
        }
    }

    toggleEmailModal = () => {
        this.setState({ isEmailModalOpen: !this.state.isEmailModalOpen });
    }

    handleEmailChange = (event) => {
        this.setState({ tempEmail: event.target.value });
    }

    handleConfirmEmail = async () => {
        if (!this.state.tempEmail) {
            toast.error("Vui lòng nhập email.");
            return;
        }

        try {
            let res = await getUserByEmail(this.state.tempEmail);

            if (res) {
                if (res && res.data) {
                    let userData = res.data;
                    this.setState({
                        fullName: userData.firstName || '',
                        phonenumber: userData.phonenumber || '',
                        email: this.state.tempEmail || userData.email,
                        address: userData.address || '',
                        reason: userData.patientData && userData.patientData[0]?.reason || '',
                        birthDate: userData.patientData && userData.patientData[0]?.birthDate || '',
                        selectedGender: this.state.genders.find(gender => gender.value === userData.gender) || '',
                        isEmailModalOpen: false
                    }, () => {
                        console.log('firstName:', userData.firstName);

                        console.log('Updated state:', this.state);
                    });

                } else {
                    toast.error("Không tìm thấy thông tin người dùng với email này.");
                }
            } else {
                console.log("API Response không có dữ liệu hợp lệ.");
                toast.error("Không có dữ liệu từ API.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    }

    handleClearInfo = () => {
        this.setState({
            fullName: '',
            phonenumber: '',
            email: '',
            address: '',
            reason: '',
            birthDate: '',
            selectedGender: '',
            doctorId: '',
            timeType: ''
        });
    }

    render() {
        let { isOpenModal, closeBookingClose, dataTime } = this.props;
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId
        }

        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'
            >
                <Modal
                    isOpen={isOpenModal}
                    className={'booking-modal-container'}
                    size="lg"
                    centered
                // backdrop={true}
                >
                    <div className="booking-modal-content">
                        <div className="booking-modal-header">
                            <span className="left">
                                <FormattedMessage id="patient.booking-modal.title" />
                            </span>
                            <span
                                className="right"
                                onClick={closeBookingClose}
                            ><i className="fas fa-times"></i></span>
                        </div>
                        <div className="booking-modal-body">
                            <div className="doctor-infor">
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataTime}
                                    isShowLinkDetail={false}
                                    isShowPrice={true}
                                />
                            </div>

                            <div className="row">
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.fullName" />
                                    </label>
                                    <input className="form-control"
                                        value={this.state.fullName}
                                        onChange={(event) => this.handleOnchangeInput(event, 'fullName')}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="patient.booking-modal.phoneNumber" />
                                    </label>
                                    <input className="form-control"
                                        value={this.state.phonenumber}
                                        onChange={(event) => this.handleOnchangeInput(event, 'phonenumber')}

                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                    <input className="form-control"
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.address" /></label>
                                    <input className="form-control"
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnchangeInput(event, 'address')}
                                    />
                                </div>

                                <div className="col-12 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                                    <input className="form-control"
                                        value={this.state.reason}
                                        onChange={(event) => this.handleOnchangeInput(event, 'reason')}
                                    />
                                </div>

                                <div className="col-6 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.birthday" /></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={this.state.birthDate || ''}
                                        onChange={(event) => this.handleOnchangeInput(event, 'birthDate')}
                                        min="1930"
                                        max={new Date().getFullYear()}
                                    />
                                </div>

                                <div className="col-6 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                    <Select
                                        value={this.state.selectedGender}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.genders}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="btn-text">
                            <button className="btn-email" onClick={this.toggleEmailModal}>
                                {/* <FormattedMessage id="patient.booking-modal.enterEmail" />
                                 */}
                                Bạn đã từng đặt lịch ở hệ thống, điền thông tin nhanh
                            </button>
                            <button
                                className="btn-clear-info"
                                onClick={this.handleClearInfo}
                            >
                                | Xóa thông tin
                            </button>
                        </div>
                        <div className="booking-modal-footer">
                            <button className="btn-booking-confirm"
                                onClick={() => this.handleConfirmBooking()}
                            >
                                <FormattedMessage id="patient.booking-modal.btnConfirm" />
                            </button>
                            <button className="btn-booking-cancel"
                                onClick={closeBookingClose}
                            >
                                <FormattedMessage id="patient.booking-modal.btnCancel" />
                            </button>

                        </div>
                    </div>
                </Modal>

                <Modal
                    isOpen={this.state.isEmailModalOpen}
                    toggle={this.toggleEmailModal}
                    className="email-modal"
                >
                    <div className="modal-header">
                        <span>Nhập Email đã đặt lịch</span>
                        <span onClick={this.toggleEmailModal}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="modal-body">
                        <input
                            type="email"
                            value={this.state.tempEmail}
                            onChange={this.handleEmailChange}
                            placeholder="Nhập email của bạn"
                            className="form-control"
                        />
                    </div>
                    <div className="modal-footer">
                        <button onClick={this.handleConfirmEmail}>OK</button>
                        <button onClick={this.toggleEmailModal}>Cancel</button>
                    </div>
                </Modal>


            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingModal));

