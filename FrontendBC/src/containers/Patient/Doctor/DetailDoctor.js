import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import { getDetailInforDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
import LikeAndShare from '../SocialPlugin/LikeAndShare';
import Comment from '../SocialPlugin/Comment';
import HomeFooter from '../../HomePage/HomeFooter.js';

class DetailDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
            currentURL: '',
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            })

            let res = await getDetailInforDoctor(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data,
                })
            }
        }
        let currentURL = `${process.env.REACT_APP_IS_LOCALHOST === "1"
            ? "https://nobithao-fe-bookingcare.vercel.app/home"
            : process.env.REACT_APP_IS_LOCALHOST === "0"
                ? "http://localhost:3000/"
                : window.location.href}/${this.state.currentDoctorId}`;
        this.setState({ currentURL });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.currentDoctorId !== this.state.currentDoctorId) {
            let currentURL = `${process.env.REACT_APP_IS_LOCALHOST === "1"
                ? "https://nobithao-fe-bookingcare.vercel.app/home"
                : process.env.REACT_APP_IS_LOCALHOST === "0"
                    ? "http://localhost:3000/"
                    : window.location.href}/${this.state.currentDoctorId}`;
            this.setState({ currentURL });
        }
    }

    render() {
        let { language } = this.props;
        let { detailDoctor, currentURL } = this.state;
        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName} `;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        // let currentURL = `${process.env.REACT_APP_IS_LOCALHOST === "1"
        //     ? "https://nobithao-fe-bookingcare.vercel.app/home"
        //     : window.location.href}/${this.state.currentDoctorId}`;

        return (
            <>
                <HomeHeader
                    isShowBanner={false}
                />
                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        <div
                            className="content-left"
                            style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}>

                        </div>
                        <div className="content-right">
                            <div className="up">
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className="down">
                                {detailDoctor && detailDoctor.Markdown
                                    && detailDoctor.Markdown.description
                                    &&
                                    <span>
                                        {detailDoctor.Markdown.description}
                                    </span>
                                }
                                <div className="like-share-plugin">
                                    <LikeAndShare
                                        dataHref={currentURL}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="schedule-doctor">
                        <div className="content-left">
                            <DoctorSchedule
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                        <div className="content-right">
                            <DoctorExtraInfor
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                    </div>
                    <div className="detail-infor-doctor">
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML
                            &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }}>

                            </div>
                        }
                    </div>
                    <div className="comment-doctor">
                        {currentURL ? (
                            <Comment dataHref={currentURL} width={"100%"} />
                        ) : (
                            <div>Đang tải bình luận...</div>
                        )}
                    </div>
                    <HomeFooter />
                </div>

            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
