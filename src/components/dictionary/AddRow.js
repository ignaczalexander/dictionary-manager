import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addDictRow } from "../../actions/dictActions";
import classNames from "classnames";

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
    if (
      nextProps.errors.add_row &&
      nextProps.errors.dict_id === this.props.dictionary._id
    ) {
      this.setState({ errors: nextProps.errors.add_row });
    }
    if (
      Object.keys(nextProps.errors).length === 0 &&
      nextProps.dictionary._id === this.props.dictionary._id
    ) {
      console.log(nextProps.dictionary._id);
      console.log(this.props.dictionary._id);

      this.setState({ domain: "", range: "" });
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({ errors: {} });
    const rowData = { domain: this.state.domain, range: this.state.range };
    this.props.addDictRow(this.props.dictionary._id, rowData);
  };
  render() {
    const { errors } = this.state;
    return (
      <form className="mb-3" onSubmit={this.onSubmit}>
        <div className="form-row">
          <div className="form-group mr-2">
            <input
              className={classNames("form-control form-control-sm", {
                "is-invalid": errors.domain
              })}
              type="text"
              name="domain"
              placeholder="Domain"
              value={this.state.domain}
              onChange={this.onChange}
            />
            {errors.domain && (
              <div className="invalid-feedback">{errors.domain}</div>
            )}
          </div>
          <div className="form-group mr-2">
            <input
              className={classNames("form-control form-control-sm", {
                "is-invalid": errors.range
              })}
              type="text"
              name="range"
              placeholder="Range"
              value={this.state.range}
              onChange={this.onChange}
            />
            {errors.range && (
              <div className="invalid-feedback">{errors.range}</div>
            )}
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Add row"
              className="btn btn-primary btn-sm"
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
