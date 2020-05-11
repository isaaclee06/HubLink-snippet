import React, { Component } from "react";
import AdminAnalytics from "./AdminAnalytics";
import AdminUserActivation from "./AdminUserActivation";

import CanvasJSReact from "../../../assets/canvas/canvasjs.react";
import ManageSubscriptions from "./ManageSubscriptions";
var CanvasJS = CanvasJSReact.CanvasJS;

class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onScatterHover(point) {
    return `<b>Date: </b>${point.x}<br /><b>Value: </b>${point.y}`;
  }

  render() {
    CanvasJS.addColorSet("greenShades", [
      //colorSet Array

      "#00c292",
      "#26c6da",
      "#ab8ce4",
    ]);

    return (
      <div>
        <div className="container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-lg-6">
                <h3>
                  Admin Dashboard
                  <small>Universal Admin panel</small>
                </h3>
                <img src={this.state.url} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <AdminAnalytics />
          <AdminUserActivation />
          <ManageSubscriptions />
        </div>
      </div>
    );
  }
}

export default AdminDashboard;
