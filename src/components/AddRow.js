import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addDictRow } from "../actions/dictActions";

class AddRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domain: "",
      range: "",
      errors: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const rowData = { domain: this.state.domain, range: this.state.range };
    this.props.addDictRow(this.props.dictionary._id, rowData);
  };
  render() {
    const { errors } = this.state;
    return (
      <form className="mb-3" onSubmit={this.onSubmit}>
        <div className="row">
          <div className="col-5">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="domain"
                placeholder="Domain"
                onChange={this.onChange}
              />
              {errors.domain && (
                <div className="invalid-feedback d-block">{errors.domain}</div>
              )}
            </div>
          </div>
          <div className="col-5">
            {" "}
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="range"
                placeholder="Range"
                onChange={this.onChange}
              />
              {errors.range && (
                <div className="invalid-feedback d-block">{errors.range}</div>
              )}
            </div>
          </div>
          <div className="col-2">
            <input
              type="submit"
              value="Add row"
              className="btn btn-primary btn-block"
            />
          </div>
        </div>
      </form>
    );
  }
}
AddRow.propTypes = {
  addDictRow: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  dicts: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
  dicts: state.dictReducer.dicts,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { addDictRow }
)(AddRow);
