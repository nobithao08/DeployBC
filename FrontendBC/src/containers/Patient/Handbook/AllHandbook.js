import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllHandbook } from '../../../services/userService';
import { withRouter } from 'react-router-dom';
import './AllHandbook.scss';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';

class AllHandbooks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbooks: [],
        };
    }

    async componentDidMount() {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                dataHandbooks: res.data ? res.data : [],
            });
        }
    }

    handleViewHandbook = (handbookId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${handbookId}`);
        }
    }

    render() {
        let { dataHandbooks } = this.state;
        return (<div>
            <HomeHeader />

            <div className="all-handbooks-container">
                <h2><FormattedMessage id="more.all-handbooks" /></h2>
                <div className="handbooks-list">
                    {dataHandbooks && dataHandbooks.length > 0 ? (
                        dataHandbooks.map((item) => (
                            <div
                                className="handbook-item"
                                key={item.id}
                                onClick={() => this.handleViewHandbook(item.id)}
                            >
                                <img src={item.image} alt={item.name} />
                                <div className="handbook-name">{item.name}</div>
                            </div>
                        ))
                    ) : (
                        <p>Không có cẩm nang nào.</p>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllHandbooks));
