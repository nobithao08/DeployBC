import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from '../../assets/logo.svg';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../utils";
import { withRouter } from 'react-router';
import { changeLanguageApp } from "../../store/actions";

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            specialties: [],
        };
    }

    componentDidMount() {
        this.fetchSpecialties();
    }

    fetchSpecialties = () => {
        const exampleSpecialties = [
            'Cơ Xương Khớp',
            'Thần kinh',
            'Tiêu hoá',
            'Da liễu',
            'Chuyên khoa Mắt',
            'Tim mạch',
            'Tai Mũi Họng',
            'Sức khỏe tâm thần',
            'Thận - Tiết niệu'
        ];
        this.setState({ specialties: exampleSpecialties });
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    }

    handleViewAllSpecialties = () => {
        if (this.props.history) {
            this.props.history.push('/all-specialties');
        }
    }

    handleViewAllHealthFacilities = () => {
        if (this.props.history) {
            this.props.history.push('/all-clinics');
        }
    }

    handleViewAllDoctors = () => {
        if (this.props.history) {
            this.props.history.push('/all-doctors');
        }
    }

    handleViewHealthGuide = () => {
        if (this.props.history) {
            this.props.history.push('/all-handbooks');
        }
    }

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    }

    render() {
        const { searchTerm, specialties } = this.state;
        const filteredSpecialties = specialties.filter(specialty =>
            specialty.toLowerCase().includes(searchTerm.toLowerCase())
        );

        let language = this.props.language;
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className="left-content">
                            <i className="fas fa-bars"></i>
                            <img
                                className="header-logo"
                                src={logo}
                                onClick={this.returnToHome}
                                alt="Logo"
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                        <div className="center-content">
                            <div className="child-content" onClick={this.handleViewAllSpecialties}>
                                <div><b><FormattedMessage id="homeheader.speciality" /></b></div>
                                <div className="subs-title"><FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className="child-content" onClick={this.handleViewAllHealthFacilities}>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className="subs-title"><FormattedMessage id="homeheader.select-room" /></div>
                            </div>
                            <div className="child-content" onClick={this.handleViewAllDoctors}>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className="subs-title"><FormattedMessage id="homeheader.select-doctor" /></div>
                            </div>
                            <div className="child-content" onClick={this.handleViewHealthGuide}>
                                <div><b><FormattedMessage id="homeheader.handbook" /></b></div>
                                <div className="subs-title"><FormattedMessage id="homeheader.select-handbook" /></div>
                            </div>
                        </div>

                        <div className='right-content'>
                            <div className="support"><i className="fas fa-question-circle"></i>
                                <FormattedMessage id="homeheader.support" />
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span>
                            </div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className="home-header-banner">
                        <div className="content-up">
                            <div className="title1"><FormattedMessage id="banner.title1" /></div>
                            <div className="title2"><FormattedMessage id="banner.title2" /></div>
                            <div className="search">
                                <i className="fas fa-search"></i>
                                <FormattedMessage id="homeheader.searchdoctor">
                                    {placeholder => (
                                        <input
                                            type="text"
                                            placeholder={placeholder}
                                            value={searchTerm}
                                            onChange={this.handleSearchChange}
                                        />
                                    )}
                                </FormattedMessage>
                                {searchTerm && (
                                    <div className="search-results">
                                        {filteredSpecialties.length > 0 ? (
                                            filteredSpecialties.map((specialty, index) => (
                                                <div key={index} className="search-result-item">
                                                    {specialty}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-results">Không tìm thấy chuyên khoa nào.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="content-down">
                            <div className="options">
                                <div className="option-child">
                                    <div className="icon-child"><i className="far fa-hospital"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child1" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-mobile-alt"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child2" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-procedures"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child3" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-flask"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child4" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-user-md"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child5" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-briefcase-medical"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child6" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
