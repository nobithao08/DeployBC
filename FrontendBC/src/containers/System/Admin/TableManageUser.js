import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from "../../../store/actions"

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt(/* Markdown-it options */);

function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
}

class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usersRedux: [],
            currentPage: 1,
            usersPerPage: 10
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                usersRedux: this.props.listUsers
            });
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteAUserRedux(user.id);
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user)
    }

    getCurrentUsers = () => {
        const { usersRedux, currentPage, usersPerPage } = this.state;
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        return usersRedux.slice(indexOfFirstUser, indexOfLastUser);
    }

    handleNextPage = () => {
        this.setState(prevState => ({
            currentPage: prevState.currentPage + 1
        }));
    }

    handlePrevPage = () => {
        this.setState(prevState => ({
            currentPage: prevState.currentPage - 1
        }));
    }

    render() {
        const currentUsers = this.getCurrentUsers();
        return (
            <React.Fragment>

                <div className="all-user mb-3">
                    <b><FormattedMessage id="manage-user.all" /></b>
                </div>

                <table id="TableManageUser">
                    <thead>
                        <tr>
                            <th><FormattedMessage id="manage-user.email" /></th>
                            <th><FormattedMessage id="manage-user.first-name" /></th>
                            <th><FormattedMessage id="manage-user.last-name" /></th>
                            <th><FormattedMessage id="manage-user.address" /></th>
                            <th><FormattedMessage id="manage-user.actions" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button onClick={() => this.handleEditUser(item)} className="btn-edit">
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button onClick={() => this.handleDeleteUser(item)} className="btn-delete">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="pagination">
                    <button onClick={this.handlePrevPage} disabled={this.state.currentPage === 1}>
                        <FormattedMessage id="pagination.previous" />
                    </button>
                    <span>
                        <FormattedMessage id="pagination.page" /> {this.state.currentPage}
                    </span>
                    <button onClick={this.handleNextPage} disabled={currentUsers.length < this.state.usersPerPage}>
                        <FormattedMessage id="pagination.next" />
                    </button>
                </div>
            </React.Fragment>
        );
    }


}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
