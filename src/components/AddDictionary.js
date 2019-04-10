import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addDictionary } from "../actions/dictActions";
class AddDictionary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      errors: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (Object.keys(nextProps.errors).length === 0) {
      this.setState({ name: "" });
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const dictData = { name: this.state.name, rows: [] };
    this.props.addDictionary(dictData);
  };
  render() {
    const { errors } = this.state;

    return (
      <div className="add-dictionary my-4">
        <form onSubmit={this.onSubmit}>
          <div className="form-row">
            <div className="form-group col">
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Dictionary name"
                onChange={this.onChange}
                value={this.state.name}
              />
              {errors.name && (
                <div className="invalid-feedback d-block">{errors.name}</div>
              )}
            </div>
            <div className="form-group col">
              <input
                type="submit"
                value="Create dictionary"
                className="btn btn-primary"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
AddDictionary.propTypes = {
  addDictionary: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { addDictionary }
)(AddDictionary);
