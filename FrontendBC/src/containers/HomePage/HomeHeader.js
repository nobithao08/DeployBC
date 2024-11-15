import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from '../../assets/logo.svg';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../utils";
import { withRouter } from 'react-router';
import { changeLanguageApp } from "../../store/actions";
import { getAllSpecialty, searchSpecialty } from '../../services/userService';

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            specialties: [],
            filteredSpecialties: [],
            isLoading: false
        };
    }

    componentDidMount() {
        this.fetchSpecialties();
    }

    fetchSpecialties = async () => {
        // console.log("Bắt đầu fetching specialties...");
        try {
            const response = await getAllSpecialty();

            if (response && response.status === 200) {
                console.log("Dữ liệu từ API:", response.data);
                if (Array.isArray(response.data)) {
                    this.setState({
                        specialties: response.data,
                        filteredSpecialties: response.data
                    });
                    console.log("Cập nhật specialties trong state.");
                } else {
                    console.warn("Dữ liệu không phải là mảng:", response.data);
                    this.setState({ specialties: [], filteredSpecialties: [] });
                }
            } else {
                console.error("Mã trạng thái không hợp lệ:", response.status);
            }
        } catch (error) {
            console.error("Lỗi khi fetching specialties:", error);
        }
    };

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

    handleViewBooking = () => {
        if (this.props.history) {
            this.props.history.push('/all-bookings');
        }
    }

    handleSearchChange = async (event) => {
        const { value } = event.target;
        // console.log("Giá trị tìm kiếm:", value);
        this.setState({ searchTerm: value, isLoading: true });

        if (value) {
            try {
                const response = await searchSpecialty(value);
                // console.log("Kết quả từ API:", response.data);

                if (response.data && Array.isArray(response.data)) {
                    // Cập nhật filteredSpecialties với dữ liệu tìm kiếm
                    this.setState({ filteredSpecialties: response.data });
                } else {
                    console.error("Không có chuyên khoa nào trong dữ liệu trả về.");
                    this.setState({ filteredSpecialties: [] });
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            } finally {
                this.setState({ isLoading: false });
            }
        } else {
            this.setState({ filteredSpecialties: this.state.specialties, isLoading: false });
        }
    };

    handleSpecialtyClick = (specialtyId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialtyId}`);
        }
    };

    render() {
        const { searchTerm, specialties, filteredSpecialties, isLoading } = this.state;
        const displaySpecialties = searchTerm ? filteredSpecialties : specialties;
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
                            <div className="booking" onClick={this.handleViewBooking}>
                                {/* <div><b><FormattedMessage id="homeheader.handbook" /></b></div>
                                 */}

                                <div className='booking-text'> <i className="fas fa-clock"></i> Lịch hẹn</div>
                            </div>
                            <div className="support">
                                <a href="https://www.facebook.com/profile.php?id=61566821611802" target="_blank" rel="noopener noreferrer">
                                    <i className="fas fa-question-circle"></i>
                                    <FormattedMessage id="homeheader.support" />
                                </a>
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
                                {isLoading && <div className="loading">Loading...</div>}
                                {searchTerm && (
                                    <div className="search-results">
                                        {displaySpecialties && displaySpecialties.length > 0 ? (
                                            displaySpecialties.map((specialty) => (
                                                <div
                                                    key={specialty.id}
                                                    className="search-result-item"
                                                    onClick={() => this.handleSpecialtyClick(specialty.id)}
                                                >
                                                    {specialty.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-results">
                                                <FormattedMessage id="banner.noResults" />
                                            </div>
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
