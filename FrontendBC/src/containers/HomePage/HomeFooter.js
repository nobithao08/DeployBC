import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './HomeFooter.scss';
import flogo from '../../assets/flogo.svg';

class HomeFooter extends Component {
    render() {
        return (
            <div className="home-footer">
                <div className="footer-container">
                    <div className="footer-top">
                        <div className="footer-logo">
                            <img src={flogo} alt="Company Logo" />
                            <p>&copy; 2024 BookingCare</p>
                        </div>
                        <div className="footer-links">
                            <a href="/about-us">
                                <FormattedMessage id="homefooter.footer.about-us" />
                            </a>
                            <a href="/contact">
                                <FormattedMessage id="homefooter.footer.contact" />
                            </a>
                            <a href="/privacy-policy">
                                <FormattedMessage id="homefooter.footer.privacy-policy" />
                            </a>
                        </div>
                        <div className="footer-contact">
                            <p>
                                <FormattedMessage id="homefooter.footer.company-name" />: BookingCare with Nobi
                            </p>
                            <p>
                                <FormattedMessage id="homefooter.footer.address" />: 123 ABC Street, District 1, Ho Chi Minh City
                            </p>
                            <p>
                                <FormattedMessage id="homefooter.footer.phone" />: 1900 00 11 22
                            </p>
                            <p>
                                <FormattedMessage id="homefooter.footer.email" />: btpthaovvk@gmail.com
                            </p>
                        </div>
                        <div className="footer-social">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
