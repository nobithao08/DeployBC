import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router-dom';
import './AllClinic.scss';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';

class AllClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
        };
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : [],
            });
        }
    }

    handleViewClinic = (clinicId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinicId}`);
        }
    }

    render() {
        let { dataClinics } = this.state;
        return (
            <div> <HomeHeader />
                <div className="all-clinics-container">
                    <h2><FormattedMessage id="more.all-clinics" /></h2>
                    <div className="clinics-list">
                        {dataClinics && dataClinics.length > 0 ? (
                            dataClinics.map((item) => (
                                <div
                                    className="clinic-item"
                                    key={item.id}
                                    onClick={() => this.handleViewClinic(item.id)}
                                >
                                    <img src={item.image} alt={item.name} />
                                    <div className="clinic-name">{item.name}</div>
                                </div>
                            ))
                        ) : (
                            <div class="loading-container">
                                <div class="loading-spinner"></div>
                                <p class="loading-text">Đang tải, vui lòng chờ...</p>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllClinic));
