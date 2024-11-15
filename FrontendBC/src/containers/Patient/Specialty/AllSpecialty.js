import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router-dom';
import './AllSpecialty.scss';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';

class AllSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
        };
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : [],
            });
        }
    }

    handleViewSpecialty = (specialtyId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialtyId}`);
        }
    }

    render() {
        let { dataSpecialty } = this.state;
        return (
            <div>
                <HomeHeader />

                <div className="all-specialties-container">
                    <h2><FormattedMessage id="more.all-specialties" /></h2>
                    <div className="specialties-list">
                        {dataSpecialty && dataSpecialty.length > 0 ? (
                            dataSpecialty.map((item) => (
                                <div
                                    className="specialties-item"
                                    key={item.id}
                                    onClick={() => this.handleViewSpecialty(item.id)}
                                >
                                    <img src={item.image} alt={item.name} />
                                    <div className="specialties-name">{item.name}</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSpecialty));
