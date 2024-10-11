import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllDoctors } from '../../../services/userService';
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
        };
    }

    async componentDidMount() {
        let res = await getAllDoctors();
        if (res && res.errCode === 0) {
            this.setState({
                dataDoctors: res.data ? res.data : [],
            });
        }
    }

    handleViewDoctor = (doctorId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctorId}`);
        }
    }

    render() {
        let { dataDoctors } = this.state;
        let { language } = this.props;
        return (
            <div>
                <HomeHeader />
                <div className="all-doctors-container">
                    <h2><FormattedMessage id="more.all-doctors" /></h2>
                    <div className="doctors-list">
                        {dataDoctors && dataDoctors.length > 0 ? (
                            dataDoctors.map((item) => {
                                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

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
                                    </div>
                                );
                            })
                        ) : (
                            <p>Không có bác sĩ nào.</p>
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
