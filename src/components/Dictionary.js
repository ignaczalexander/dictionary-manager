import React, { Component } from "react";
import DictionaryRow from "./DictionaryRow";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteDictionary, deleteDictRow } from "../actions/dictActions";
import AddRow from "./AddRow";

class Dictionary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDelete = e => {
    this.props.deleteDictionary(this.props.dictionary._id);
  };
  onDeleteRow = row_id => {
    this.props.deleteDictRow(this.props.dictionary._id, row_id);
  };

  render() {
    const { dictionary } = this.props;
    const rows = dictionary.rows.map(row => (
      <DictionaryRow
        key={row._id}
        dict_id={dictionary._id}
        row={row}
        onDeleteRow={this.onDeleteRow}
      />
    ));
    const tablePlace =
      dictionary.rows.length === 0 ? (
        <p className="text-center">This dictionary is empty</p>
      ) : (
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Range</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      );

    return (
      <div className="row mb-3">
        <div className="col-md-10 p-3 shadow-sm">
          <h4>{dictionary.name}</h4>
          <AddRow dictionary={this.props.dictionary} />
          {tablePlace}
          <button
            className="btn btn-danger float-right"
            onClick={this.onDelete}
          >
            Delete dictionary
          </button>
        </div>
      </div>
    );
  }
}
Dictionary.propTypes = {
  deleteDictionary: PropTypes.func.isRequired,
  deleteDictRow: PropTypes.func.isRequired,
  dicts: PropTypes.array.isRequired,
  dictionary: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  dicts: state.dictReducer.dicts
});
export default connect(
  mapStateToProps,
  { deleteDictionary, deleteDictRow }
)(Dictionary);
