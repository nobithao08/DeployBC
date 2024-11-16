import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getAllDetailSpecialtyById, getAllCodeService } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
            doctorCountByProvince: {} // Thêm state để lưu số lượng bác sĩ theo tỉnh
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            // Gọi API lấy dữ liệu chuyên khoa
            let res = await getAllDetailSpecialtyById({
                id: id,
                location: 'ALL'
            });

            // Gọi API lấy danh sách tỉnh
            let resProvince = await getAllCodeService('PROVINCE');

            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                let doctorCountByProvince = {}; // Số lượng bác sĩ theo tỉnh
                let totalDoctors = 0; // Tổng số bác sĩ cho "Toàn quốc"

                // Nếu có dữ liệu bác sĩ
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.forEach(item => {
                            let province = item.provinceId || 'ALL';

                            // Tính số bác sĩ trong từng tỉnh
                            if (!doctorCountByProvince[province]) {
                                doctorCountByProvince[province] = 0;
                            }
                            doctorCountByProvince[province]++;

                            // Cộng dồn tổng số bác sĩ cho "Toàn quốc"
                            totalDoctors++;
                        });

                        // Gán tổng số bác sĩ cho key "ALL"
                        doctorCountByProvince['ALL'] = totalDoctors;
                    }
                }

                // Thêm "Toàn quốc" vào danh sách tỉnh
                let dataProvince = resProvince.data;
                if (dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        keyMap: "ALL",
                        type: "PROVINCE",
                        valueEn: "All provinces",
                        valueVi: "Toàn quốc",
                    });
                }

                // Cập nhật state
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: data.doctorSpecialty.map(item => item.doctorId),
                    listProvince: dataProvince ? dataProvince : [],
                    doctorCountByProvince: doctorCountByProvince // Lưu số lượng bác sĩ
                });
            }
        }
    }



    async handleOnChangeSelect(event) {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;

            let res = await getAllDetailSpecialtyById({
                id: id,
                location: location
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];

                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arrDoctorId = arr.map(item => item.doctorId);
                    }
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                });
            }
        }
    }


    render() {
        let { arrDoctorId, dataDetailSpecialty, listProvince, doctorCountByProvince } = this.state;
        let { language } = this.props;

        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="detail-specialty-body">
                    <div className="description-specialty">
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) &&
                            <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}></div>
                        }
                    </div>

                    <div className="search-sp-doctor">
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {listProvince && listProvince.length > 0 &&
                                listProvince.map((item, index) => {
                                    const provinceName = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                                    const doctorCount = doctorCountByProvince[item.keyMap] || 0; // Lấy số lượng bác sĩ
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {provinceName} ({doctorCount} bác sĩ)
                                        </option>
                                    );
                                })
                            }
                        </select>
                    </div>




                    {arrDoctorId && arrDoctorId.length > 0 ? (
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className="each-doctor" key={index}>
                                    <div className="dt-content-left">
                                        <div className="profile-doctor">
                                            <ProfileDoctor
                                                key={item}
                                                doctorId={item}
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="dt-content-right">
                                        <div className="doctor-schedule">
                                            <DoctorSchedule doctorIdFromParent={item} />
                                        </div>
                                        <div className="doctor-extra-info">
                                            <DoctorExtraInfor doctorIdFromParent={item} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-doctors-message">
                            <FormattedMessage id="specialty.no-doctors" defaultMessage="Không có bác sĩ nào ở tỉnh/thành phố này." />
                        </div>
                    )}
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
