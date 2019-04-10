import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateDictRow } from "../actions/dictActions";

class DictionaryRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyEditing: false,
      domain: "",
      range: "",
      errors: {}
    };
  }

  componentDidMount() {
    this.setState({
      domain: this.props.row.domain,
      range: this.props.row.range
    });
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errors.update_row &&
      nextProps.errors.row_id === this.props.row._id
    ) {
      this.setState({ errors: nextProps.errors.update_row });
    }
  }
  startEditing = e => {
    this.setState({ currentlyEditing: true, errors: {} });
  };
  stopEditing = e => {
    this.setState({
      currentlyEditing: false,
      domain: this.props.row.domain,
      range: this.props.row.range,
      errors: {}
    });
  };
  saveEdit = e => {
    const rowData = { domain: this.state.domain, range: this.state.range };
    this.props.updateDictRow(this.props.dict_id, this.props.row._id, rowData);
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const { row } = this.props;
    const { currentlyEditing, errors, domain, range } = this.state;
    return (
      <tr>
        <td>
          {currentlyEditing ? (
            <div className="form-group m-0">
              <input
                className="form-control form-control-sm"
                type="text"
                name="domain"
                placeholder="Domain"
                value={domain}
                onChange={this.onChange}
              />
              {errors.domain && (
                <div className="invalid-feedback d-block">{errors.domain}</div>
              )}
            </div>
          ) : (
            row.domain
          )}
        </td>
        <td>
          {currentlyEditing ? (
            <div className="form-group m-0">
              <input
                className="form-control form-control-sm"
                type="text"
                name="range"
                placeholder="Range"
                value={range}
                onChange={this.onChange}
              />
              {errors.range && (
                <div className="invalid-feedback d-block">{errors.range}</div>
              )}
            </div>
          ) : (
            row.range
          )}
        </td>
        <td>
          {currentlyEditing ? (
            <div>
              <button
                className="btn btn-sm btn-success"
                onClick={this.saveEdit}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={this.stopEditing}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-sm btn-info" onClick={this.startEditing}>
              Edit
            </button>
          )}
        </td>
        <td>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => this.props.onDeleteRow(row._id)}
          >
            Delete row
          </button>
        </td>
        <td>
          {row.msg.chain || row.msg.cycle || row.msg.fork || row.msg.duplicate}
        </td>
      </tr>
    );
  }
}

DictionaryRow.propTypes = {
  updateDictRow: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { updateDictRow }
)(DictionaryRow);
