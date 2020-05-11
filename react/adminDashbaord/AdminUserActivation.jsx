import React, { Component } from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import adminService from "../../../services/adminService";
import { Collapse, Button, Form, Input } from "reactstrap";
import { toast } from "react-toastify";

class AdminUserActivation extends Component {
  state = {
    isOpen: false,
    currentPagedUsers: [],
    query: "",
    pagination: {
      currentPage: 1,
      totalUsers: 0,
      usersPerPage: 8,
      isSearching: false,
    },
  };

  ref = React.createRef();

  componentDidMount() {
    this.getUserProfiles();
  }

  getUserProfiles = () => {
    if (this.state.pagination.isSearching) {
      this.getSeachPaginated(
        this.state.query,
        this.state.pagination.currentPage - 1,
        this.state.pagination.usersPerPage
      );
    } else {
      this.getUsersPaginated(
        this.state.pagination.currentPage - 1,
        this.state.pagination.usersPerPage
      );
    }
  };

  onChangeUserStatusSuccess = () => {
    toast.success("Success!");
    this.getUserProfiles();
  };

  onChangeUserStatusError = () => {
    toast.error(
      "We encountered an error chaging the status of the user. Please refresh and try again. If the problem persists please contact an administrator."
    );
  };

  onGetUsersSuccess = (response) => {
    this.setState((prevState) => {
      let prevPagination = prevState.pagination;
      prevPagination.currentPage = response.item.pageIndex + 1;
      prevPagination.totalUsers = response.item.totalCount;
      prevPagination.isSearching = false;
      return {
        currentPagedUsers: response.item.pagedItems,
        pagination: prevPagination,
      };
    });
  };

  onGetUsersError = () => {
    toast.error(
      "We encountered an error retrieving the user profiles. Please refresh and try again. If the problem persists please contact an administrator."
    );
  };

  onSearchSuccess = (response) => {
    this.setState((prevState) => {
      let prevPagination = prevState.pagination;
      prevPagination.currentPage = response.item.pageIndex + 1;
      prevPagination.totalUsers = response.item.totalCount;
      prevPagination.isSearching = true;
      return {
        currentPagedUsers: response.item.pagedItems,
        pagination: prevPagination,
      };
    });
  };

  onSearchError = (error) => {
    let errorMessage =
      "We encountered an error during the search. Please refresh and try again. If the problem persists please contact an administrator.";
    if (error.response.data) {
      errorMessage = error.response.data.errors[0];
    }
    toast.error(errorMessage);
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();

    this.getSeachPaginated(
      this.state.query,
      0,
      this.state.pagination.usersPerPage
    );
  };

  onCancelSeachClick = (e) => {
    e.preventDefault();
    this.getUsersPaginated(0, this.state.pagination.usersPerPage);
  };

  handleChange = (e) => {
    let target = e.target;
    this.setState({ query: target.value });
  };

  onChangeUserStatusClick = (e) => {
    e.preventDefault();
    const card = e.target.closest(".col-xl-3");
    const isActive = JSON.parse(card.getAttribute("active"));
    const userId = JSON.parse(card.getAttribute("userid"));
    const newStatusId = isActive === 1 ? 2 : 1;
    const payload = { Id: userId, UserStatusId: newStatusId };
    adminService
      .setUserStatusId(payload)
      .then(this.onChangeUserStatusSuccess)
      .catch(this.onChangeUserStatusError);
  };

  onPageChange = (page) => {
    if (this.state.pagination.isSearching) {
      this.getSeachPaginated(
        this.state.query,
        page - 1,
        this.state.pagination.usersPerPage
      );
    } else {
      this.getUsersPaginated(page - 1, this.state.pagination.usersPerPage);
    }
    this.ref.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  toggleCollapse = () => {
    this.setState((prevState) => {
      return { isOpen: !prevState.isOpen };
    });
  };

  getSeachPaginated = (query, pageIndex, pageSize) => {
    adminService
      .userProfileSearch(query, pageIndex, pageSize)
      .then(this.onSearchSuccess)
      .catch(this.onSearchError);
  };

  getUsersPaginated = (pageIndex, pageSize) => {
    adminService
      .getPaginatedProfiles(pageIndex, pageSize)
      .then(this.onGetUsersSuccess)
      .catch(this.onGetUsersError);
  };

  mapUserCard = (userProfile) => {
    let isActive = userProfile.userStatusId === 1 ? true : false;

    return (
      <div
        className="col-xl-3 col-lg-6 col-sm-6"
        key={userProfile.id}
        userid={userProfile.id}
        active={userProfile.userStatusId}
      >
        <div className="card" style={{ backgroundColor: "#DCE9FD" }}>
          <div className="card-body">
            <b className="stat-widget-dashboard">{`${userProfile.firstName} ${userProfile.lastName}`}</b>
            <div>
              {`${userProfile.email}`}
              <img
                className="pull-right"
                style={{
                  height: "8ch",
                  width: "8ch",
                  borderRadius: "50%",
                  backgroundColor: "white",
                }}
                src={userProfile.avatarUrl}
                alt="Avatar"
              ></img>

              <p>Account Type: {userProfile.userRole}</p>
            </div>

            <div className={"mt-1"}>
              <Button
                color="success"
                className={"mt-2"}
                hidden={isActive}
                onClick={this.onChangeUserStatusClick}
              >
                Activate
              </Button>
              <Button
                color="danger"
                className={"mt-3"}
                hidden={!isActive}
                onClick={this.onChangeUserStatusClick}
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  render() {
    return (
      <div ref={this.ref}>
        <Button color="info" className={"mb-4"} onClick={this.toggleCollapse}>
          Activate/Deactivate Users
        </Button>
        <Collapse isOpen={this.state.isOpen}>
          <div className="card">
            <h1 className="card-header">Activate/Deactivate Users</h1>

            <div>
              <Form
                style={{ display: "flex" }}
                className={"col-md-4 pt-4 theme-form"}
              >
                <Input
                  className="mt-4"
                  type="text"
                  name="query"
                  onChange={this.handleChange}
                  value={this.state.query}
                  placeholder={"Search..."}
                />
                <Button
                  color="info"
                  className="mt-4 icofont icofont-search-alt-1"
                  type="submit"
                  onClick={this.handleSearchSubmit}
                />
                <Button
                  style={{
                    visibility: `${
                      this.state.pagination.isSearching ? "" : "hidden"
                    }`,
                  }}
                  className="mt-4 btn-danger"
                  type="submit"
                  onClick={this.onCancelSeachClick}
                >
                  Cancel Search{" "}
                </Button>
              </Form>
            </div>

            <div className="row mr-2 ml-2 mt-4">
              {this.state.currentPagedUsers.map(this.mapUserCard)}
            </div>
            <div className="card-footer">
              <Pagination
                className={"mb-4"}
                onChange={this.onPageChange}
                current={this.state.pagination.currentPage}
                total={this.state.pagination.totalUsers}
                defaultPageSize={this.state.pagination.usersPerPage}
              />
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

export default AdminUserActivation;
