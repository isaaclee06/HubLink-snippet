import React from "react";
import { Button, Collapse } from "reactstrap";
import stripeService from "../../../services/stripeService";
import swal from "sweetalert";
import { toast } from "react-toastify";
import CreateSubscriptionModal from "./CreateSubscriptionModal";

class ManageSubscriptions extends React.Component {
  state = {
    collapseIsOpen: false,
    modalIsOpen: false,
    subscriptionPlans: [],
  };

  componentDidMount() {
    this.getPlans();
  }

  getPlans = () => {
    stripeService
      .getPlans()
      .then(this.onGetPlansSuccess)
      .catch(this.onGetPlansError);
  };

  onGetPlansSuccess = (response) => {
    const plans = response.items;

    this.setState({ subscriptionPlans: plans });
  };

  onGetPlansError = (response) => {
    let errorMessage =
      "There was an error retrieving the plans. Please refresh the page to try again. If the error persists please contact and Administrator";
    if (response.response) {
      errorMessage = response.response.data.errors[0];
    }
    toast.error(errorMessage);
  };

  onDeletePlanSuccess = () => {
    toast.success("Subscription plan successfully deleted");
    this.getPlans();
  };

  onDeletePlanError = (error) => {
    let errorMessage =
      "There was an error retrieving the plans. Please refresh the page to try again. If the error persists please contact and Administrator";
    if (error.response) {
      errorMessage = error.response.data.errors[0];
    }
    toast.error(errorMessage);
  };

  toggleCollapse = () => {
    this.setState((prevState) => {
      return { collapseIsOpen: !prevState.collapseIsOpen };
    });
  };

  toggleModal = () => {
    this.setState((prevState) => {
      return { modalIsOpen: !prevState.modalIsOpen };
    });
  };

  onDeletePlanClick = (e) => {
    e.preventDefault();
    const card = e.target.closest(".col-xl-3");
    const planId = card.getAttribute("data-id");
    swal({
      title: "Are you sure you want to delete this subscription?",

      icon: "warning",
      buttons: {
        cancel: "Cancel",
        delete: { text: "Delete", value: planId },
      },
    }).then(this.deleteConfirm);
  };

  deleteConfirm = (planId) => {
    if (planId) {
      stripeService
        .deletePlan(planId)
        .then(this.onDeletePlanSuccess)
        .catch(this.onDeletePlanError);
    } else {
      swal({ title: "Your subscription plan is safe!" });
    }
  };

  mapSubscription = (plan) => {
    return (
      <div
        className="col-xl-3 col-lg-6 col-sm-6"
        data-id={plan.planId}
        key={plan.id}
      >
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{plan.productName}</h3>
          </div>
          <div className="card-body">
            {plan.price} /{" "}
            {plan.subscriptionType.substring(
              0,
              plan.subscriptionType.length - 2
            )}
            <Button
              onClick={this.onDeletePlanClick}
              color="danger"
              className="pull-right"
            >
              Delete Plan
            </Button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Button color="info" className={"mb-4"} onClick={this.toggleCollapse}>
          Manage Subscriptions
        </Button>
        <Collapse isOpen={this.state.collapseIsOpen}>
          <div className="row">
            {this.state.subscriptionPlans.map(this.mapSubscription)}
          </div>
          <Button color="info" className="mb-4" onClick={this.toggleModal}>
            Create New Subscription Plan
          </Button>
        </Collapse>
        <CreateSubscriptionModal
          isOpen={this.state.modalIsOpen}
          toggleModal={this.toggleModal}
          getPlans={this.getPlans}
        />
      </React.Fragment>
    );
  }
}

export default ManageSubscriptions;
