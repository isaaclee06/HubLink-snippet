import React from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { Label, Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import swal from "sweetalert";
import stripeService from "../../../services/stripeService";
import propTypes from "prop-types";

class CreateSubscriptionModal extends React.Component {
  state = { planForm: { Amount: "", Name: "", Interval: "" } };

  onCreateSubscriptionSuccess = () => {
    swal("You have successfully created a new subscription!", "", "success")
      .then(this.props.toggleModal())
      .then(this.props.getPlans());
  };

  onCreateSubscriptionError = (response) => {
    let errorMessage =
      "There was an error while creating a new subscription. Please refresh the page and try again. If the error persists contact an administrator.";
    if (response.response) {
      for (let error of response.response.data.errors) {
        errorMessage += error + "\n";
      }
    }
    swal("Subscription Creation Error", errorMessage, "error");
  };

  handleSubmit = (formData, { setSubmitting }) => {
    setSubmitting(true);
    const payload = {
      Amount: formData.Amount,
      Name: formData.Name,
      Interval: formData.Interval,
    };
    stripeService
      .createPlan(payload)
      .then(this.onCreateSubscriptionSuccess)
      .catch(this.onCreateSubscriptionError);

    setSubmitting(false);
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggleModal}
          centered={true}
        >
          <ModalHeader>Create Subscription</ModalHeader>
          <ModalBody>
            <Formik
              enableReinitialize={true}
              validationSchema={Yup.object().shape({
                Amount: Yup.string()
                  .matches(
                    /^\$[0-9]+\.[0-9][0-9]$/,
                    "This field cannot use commas and must contain a '$' and exactly two decimal places eg. $2021.01"
                  )
                  .required("Required"),
                Name: Yup.string().required("Required"),
                Interval: Yup.string().required("Required"),
              })}
              initialValues={this.state.planForm}
              onSubmit={this.handleSubmit}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  handleSubmit,
                  isValid,
                  isSubmitting,
                } = props;
                return (
                  <React.Fragment>
                    <Form action="/">
                      <div>
                        <Label>Subsctiption Name</Label>
                        <Field
                          name="Name"
                          type="text"
                          values={values.Name}
                          placeholder="Premium Plan, Standard, etc."
                          autoComplete="off"
                          className="form-control col-10"
                        />
                        {errors.Name && touched.Name && (
                          <span
                            className="input-feedback"
                            style={{ color: "red" }}
                          >
                            {errors.Name}
                          </span>
                        )}
                      </div>

                      <div className="mt-4">
                        <Label>Frequency</Label>
                        <Field
                          name="Interval"
                          component="select"
                          values={values.Interval}
                          label="Interval"
                          className="col-10 form-control"
                          as="select"
                        >
                          <option value="">Select One</option>
                          <option value="Month">Monthly</option>
                          <option value="Year">Yearly</option>
                        </Field>
                        {errors.Interval && touched.Interval && (
                          <span
                            className="input-feedback"
                            style={{ color: "red" }}
                          >
                            {errors.Interval}
                          </span>
                        )}
                      </div>
                      <div className="mt-4">
                        <Label>Price Per Frequency</Label>
                        <Field
                          name="Amount"
                          type="text"
                          values={values.Amount}
                          placeholder="$0.00"
                          autoComplete="off"
                          className="form-control col-10"
                        />
                        {errors.Amount && touched.Amount && (
                          <span
                            className="input-feedback"
                            style={{ color: "red" }}
                          >
                            {errors.Amount}
                          </span>
                        )}
                      </div>
                    </Form>
                    <Button
                      color="info"
                      className="mt-4"
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </React.Fragment>
                );
              }}
            </Formik>
            <Button
              className="pull-right mt-4"
              color="danger"
              onClick={this.props.toggleModal}
            >
              Cancel
            </Button>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

CreateSubscriptionModal.propTypes = {
  isOpen: propTypes.bool,
  toggleModal: propTypes.func,
  getPlans: propTypes.func,
};

export default CreateSubscriptionModal;
