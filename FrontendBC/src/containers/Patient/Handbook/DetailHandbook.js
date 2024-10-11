import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailHandbook.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import { getAllDetailHandbookById, getAllCodeService } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';

class DetailHandbook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandbook: {},
        }
    }


    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getAllDetailHandbookById({
                id: id
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                this.setState({
                    dataDetailHandbook: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }



    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    render() {
        let { arrDoctorId, dataDetailHandbook } = this.state;
        let { language } = this.props;
        return (
            <div className="detail-handbook-container">
                <HomeHeader />
                <div className="detail-handbook-body">
                    {dataDetailHandbook && !_.isEmpty(dataDetailHandbook) &&
                        <>
                            <div className="description-handbook-name">{dataDetailHandbook.name}</div>

                            <div className="description-handbook" dangerouslySetInnerHTML={{ __html: dataDetailHandbook.descriptionMarkdown }}>
                            </div>
                        </>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);
