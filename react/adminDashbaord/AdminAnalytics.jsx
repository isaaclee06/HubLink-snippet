import React, { Component } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import CountUp from "react-countup";
import adminService from "../../../services/adminService";
import { toast } from "react-toastify";

class AdminAnalytics extends Component {
  state = {
    userCount: 0,
    organizationCount: 0,
    activeUsersCount: 0,
    dailyActiveUsersCount: 0,
  };

  componentDidMount = () => {
    this.getAdminCounts();
  };

  getAdminCounts = () => {
    adminService
      .getAdminCounts()
      .then(this.onGetCountsSuccess)
      .catch(this.onGetCountsError);
  };

  onGetCountsSuccess = (response) => {
    this.setState({
      userCount: response.item.userCount,
      organizationCount: response.item.organizationCount,
      activeUsersCount: response.item.activeUserCount,
      dailyActiveUsersCount: response.item.dailyActiveUsersCount,
    });
  };

  onGetCountsError = () => {
    toast.error(
      "There was an loading the page, please try. If the error persists please contact and admin"
    );
  };

  render() {
    return (
      <div className="row">
        <div className="col-xl-3 col-lg-6 col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="stat-widget-dashboard">
                <div className="media">
                  <i
                    className="icofont icofont-users-alt-5"
                    style={{ color: "#AEAEAE" }}
                  />
                  <div className="media-body text-right">
                    <h4 className="mt-0">
                      <CountUp
                        className="font-primary"
                        end={this.state.userCount}
                      />
                    </h4>
                    <span>Number of Users</span>
                  </div>
                </div>
                <div className="dashboard-chart-container-small">
                  <Sparklines
                    data={[
                      25,
                      50,
                      30,
                      40,
                      60,
                      21,
                      20,
                      10,
                      4,
                      13,
                      0,
                      this.state.userCount,
                    ]}
                  >
                    <SparklinesLine color="#bca0ee" />
                  </Sparklines>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="stat-widget-dashboard">
                <div className="media">
                  <i
                    className="icofont icofont-building-alt"
                    style={{ color: "#AEAEAE" }}
                  />
                  <div className="media-body text-right">
                    <h4 className="mt-0 ">
                      <CountUp
                        className="font-secondary"
                        end={this.state.organizationCount}
                      />
                    </h4>
                    <span>Total Linked Institutions</span>
                  </div>
                </div>
                <div className="dashboard-chart-container-small">
                  <Sparklines
                    data={[
                      5,
                      10,
                      20,
                      14,
                      17,
                      21,
                      20,
                      10,
                      4,
                      13,
                      0,
                      this.state.organizationCount,
                    ]}
                  >
                    <SparklinesLine color="#38d3e7" />
                  </Sparklines>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="stat-widget-dashboard">
                <div className="media">
                  <i
                    className="mr-3, icofont icofont-checked"
                    style={{ color: "#AEAEAE" }}
                  />
                  <div className="media-body text-right">
                    <h4 className="mt-0 counter font-success">
                      <CountUp
                        className="font-success"
                        end={this.state.activeUsersCount}
                      />
                    </h4>
                    <span>Active Users</span>
                  </div>
                </div>
                <div className="dashboard-chart-container-small">
                  <Sparklines
                    data={[
                      25,
                      50,
                      30,
                      40,
                      60,
                      21,
                      20,
                      10,
                      4,
                      13,
                      0,
                      this.state.activeUsersCount,
                    ]}
                  >
                    <SparklinesLine color="#00c292" />
                  </Sparklines>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-sm-6">
          <div className="card">
            <div className="card-body">
              <div className="stat-widget-dashboard">
                <div className="media">
                  <i
                    className="mr-3, icofont icofont-sun-alt"
                    style={{ color: "#AEAEAE" }}
                  />
                  <div className="media-body text-right">
                    <h4 className="mt-0">
                      <CountUp
                        className="font-info"
                        end={this.state.dailyActiveUsersCount}
                      />
                    </h4>
                    <span>Daily Active Users</span>
                  </div>
                </div>
                <div className="dashboard-chart-container-small">
                  <Sparklines
                    data={[
                      5,
                      10,
                      20,
                      14,
                      17,
                      21,
                      20,
                      10,
                      4,
                      13,
                      0,
                      this.state.dailyActiveUsersCount,
                    ]}
                  >
                    <SparklinesLine color="#59a6fe" />
                  </Sparklines>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminAnalytics;
