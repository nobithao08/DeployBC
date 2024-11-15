import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import { getAllDoctors, getDoctorStatsByMonth } from '../../../services/userService';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';
import { Buffer } from 'buffer';

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
            dataDoctors: [],
            doctorStats: {},
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }

    async componentDidMount() {
        this.props.loadTopDoctors();
        let res = await getAllDoctors();
        if (res && res.errCode === 0) {
            this.setState({
                dataDoctors: res.data ? res.data : []
            });
        }

        const doctorStats = {};
        for (let doctor of this.state.dataDoctors) {
            let stats = await getDoctorStatsByMonth(doctor.id);

            if (stats && Array.isArray(stats)) {
                const totalAppointments = stats
                    .filter(item => item["doctorInfo.id"] === doctor.id)
                    .reduce((sum, item) => {
                        const count = parseInt(item.completed, 10);
                        return sum + (!isNaN(count) ? count : 0);
                    }, 0);
                console.log(`Dữ liệu lịch hẹn của bác sĩ`, totalAppointments);

                doctorStats[doctor.id] = totalAppointments;
            } else {
                doctorStats[doctor.id] = 0;
            }
        }

        console.log("Tổng số lượng lịch hẹn của từng bác sĩ: ", doctorStats);

        const sortedDoctorStats = Object.entries(doctorStats)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);

        this.setState({
            doctorStats,
            sortedDoctorStats,
        });
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
    }

    handleViewAllDoctors = () => {
        if (this.props.history) {
            this.props.history.push(`/all-doctors`);
        }
    }

    render() {
        let arrDoctors = this.state.arrDoctors;
        let { language } = this.props;
        let { doctorStats, sortedDoctorStats } = this.state;

        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homepage.outstanding-doctor" />
                        </span>
                        <button className="btn-section" onClick={this.handleViewAllDoctors}>
                            <FormattedMessage id="homepage.more-infor" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {sortedDoctorStats && sortedDoctorStats.length > 0
                                && sortedDoctorStats.map((doctorId, index) => {
                                    const doctor = arrDoctors.find(item => item.id === parseInt(doctorId));
                                    if (!doctor) return null;

                                    let imageBase64 = '';
                                    if (doctor.image) {
                                        imageBase64 = Buffer.from(doctor.image, 'base64').toString('binary');
                                    }

                                    let nameVi = `${doctor.positionData.valueVi}, ${doctor.lastName} ${doctor.firstName}`;
                                    let nameEn = `${doctor.positionData.valueEn}, ${doctor.firstName} ${doctor.lastName}`;
                                    let appointmentCount = doctorStats[doctor.id] || 0;

                                    return (
                                        <div className="section-customize" key={index} onClick={() => this.handleViewDetailDoctor(doctor)}>
                                            <div className="customize-border">
                                                <div className="outer-bg">
                                                    <div className="bg-image section-outstading-doctor"
                                                        style={{ backgroundImage: `url(${imageBase64})` }}
                                                    />
                                                </div>
                                                <div className="position text-center">
                                                    <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                                    <div className="appointment-count" style={{ color: '#ff8c00' }}>
                                                        {`Lượt khám: ${appointmentCount}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
