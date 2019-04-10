import React, { Component } from "react";
import "../../App.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteDictionary, deleteDictRow } from "../../actions/dictActions";
import DicitonaryHeader from "./header/DicitonaryHeader";
import AddRow from "./AddRow";
import DictionaryRow from "./DictionaryRow";

class Dictionary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      expanded: false
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDelete = e => {
    if (window.confirm("Are you sure you wish to delete this item?"))
      this.props.deleteDictionary(this.props.dictionary._id);
  };
  onDeleteRow = row_id => {
    this.props.deleteDictRow(this.props.dictionary._id, row_id);
  };
  toggleDropDown = e => {
    this.setState({ expanded: !this.state.expanded });
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
        <p className="text-center text-muted">This dictionary is empty</p>
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
      <div className="dictionary p-3 mb-3 border">
        <DicitonaryHeader
          expanded={this.state.expanded}
          toggleDropDown={this.toggleDropDown}
          dictionary={this.props.dictionary}
          onDelete={this.onDelete}
        />

        {this.state.expanded && (
          <div className="dictionary-body p-3">
            <AddRow dictionary={this.props.dictionary} />
            {tablePlace}
          </div>
        )}
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
