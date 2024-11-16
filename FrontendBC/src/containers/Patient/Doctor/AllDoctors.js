import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllDoctors, getDoctorStatsByMonth } from '../../../services/userService';
import { withRouter } from 'react-router-dom';
import './AllDoctors.scss';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import { LANGUAGES } from '../../../utils';

class AllDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDoctors: [],
            doctorStats: {},
            sortOption: 'name',
        };
    }

    async componentDidMount() {
        let res = await getAllDoctors();
        if (res && res.errCode === 0) {
            this.setState(
                {
                    dataDoctors: res.data ? res.data : [],
                },
                this.sortDoctors
            );
        }

        const doctorStats = {};
        for (let doctor of res.data || []) {
            let stats = await getDoctorStatsByMonth(doctor.id);

            if (stats && Array.isArray(stats)) {
                const totalAppointments = stats
                    .filter(item => item["doctorInfo.id"] === doctor.id)
                    .reduce((sum, item) => {
                        const count = parseInt(item.completed, 10);
                        return sum + (!isNaN(count) ? count : 0);
                    }, 0);
                doctorStats[doctor.id] = totalAppointments;
            } else {
                doctorStats[doctor.id] = 0;
            }
        }

        this.setState({ doctorStats }, this.sortDoctors);
    }


    handleViewDoctor = (doctorId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctorId}`);
        }
    }

    handleSortChange = (event) => {
        const sortOption = event.target.value;
        this.setState({ sortOption }, this.sortDoctors);
    }

    sortDoctors = () => {
        const { sortOption, dataDoctors, doctorStats } = this.state;
        let sortedDoctors = [...dataDoctors];

        if (sortOption === 'appointment') {
            sortedDoctors.sort((a, b) => (doctorStats[b.id] || 0) - (doctorStats[a.id] || 0));
        } else if (sortOption === 'name') {
            sortedDoctors.sort((a, b) => {
                const nameA = a.firstName + ' ' + a.lastName;
                const nameB = b.firstName + ' ' + b.lastName;
                return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
            });
        }

        this.setState({ dataDoctors: sortedDoctors });
    }


    render() {
        let { dataDoctors, doctorStats, sortOption } = this.state;
        let { language } = this.props;

        return (
            <div>
                <HomeHeader />
                <div className="all-doctors-container">
                    <h2><FormattedMessage id="more.all-doctors" /></h2>

                    <div className="sort-container">
                        <select
                            className="sort-select"
                            value={sortOption}
                            onChange={this.handleSortChange}
                        >
                            <option value="name">Sắp xếp theo tên</option>
                            <option value="appointment">Sắp xếp theo lượt khám</option>

                        </select>
                    </div>

                    <div className="doctors-list">
                        {dataDoctors && dataDoctors.length > 0 ? (
                            dataDoctors.map((item) => {
                                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                let appointmentCount = doctorStats[item.id] || 0;

                                return (
                                    <div
                                        className="doctor-item"
                                        key={item.id}
                                        onClick={() => this.handleViewDoctor(item.id)}
                                    >
                                        <img src={item.image} alt={nameEn} />
                                        <div className="doctor-name">
                                            {language === LANGUAGES.VI ? nameVi : nameEn}
                                        </div>
                                        <div className="appointment-count">
                                            {`Lượt khám: ${appointmentCount}`}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p className="loading-text">Đang tải, vui lòng chờ...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllDoctors));
