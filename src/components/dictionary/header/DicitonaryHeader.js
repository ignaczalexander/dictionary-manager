import React, { Component } from "react";
import classNames from "classnames";
import UpdateName from "./UpdateName";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateDictionary } from "../../../actions/dictActions";

class DicitonaryHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyEditing: false,
      name: "",
      errors: {}
    };
  }
  componentDidMount() {
    this.setState({
      name: this.props.dictionary.name
    });
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errors.update_dict &&
      nextProps.errors.dict_id === this.props.dictionary._id
    ) {
      this.setState({ errors: nextProps.errors.update_dict });
    }

    if (!nextProps.errors.update_dict) {
      this.stopEditing();
    }
    if (nextProps.dictionary) {
      this.setState({ name: nextProps.dictionary.name });
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  startEditing = e => {
    this.setState({ currentlyEditing: true, errors: {} });
  };
  stopEditing = e => {
    this.setState({
      currentlyEditing: false,
      name: this.props.dictionary.name,
      errors: {}
    });
  };
  saveEdit = e => {
    e.preventDefault();
    this.props.updateDictionary(this.props.dictionary._id, {
      name: this.state.name
    });
    //  this.setState({ currentlyEditing: false });
  };
  render() {
    const { dictionary, expanded } = this.props;
    return (
      <div className="dicitonary-header row justify-content-between">
        <div
          className="col cursor"
          onClick={
            this.state.currentlyEditing ? () => {} : this.props.toggleDropDown
          }
        >
          <div className="row">
            <div className="col-auto">
              <i
                className={classNames("fas px-2 fa-sm", {
                  "fa-chevron-down": !expanded,
                  "fa-chevron-up": expanded
                })}
              />
            </div>
            <div className="col-auto">
              {this.state.currentlyEditing ? (
                <UpdateName
                  onChange={this.onChange}
                  name={this.state.name}
                  errors={this.state.errors}
                  saveEdit={this.saveEdit}
                  stopEditing={this.stopEditing}
                />
              ) : (
                <h5
                  className={classNames({
                    "mb-3": expanded,
                    "m-0": !expanded
                  })}
                >
                  {dictionary.name}
                </h5>
              )}
            </div>
          </div>
        </div>
        <div className="col-auto">
          <div className="dropdown">
            <i
              className="fas fa-ellipsis-v cursor px-2"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            />

            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item" onClick={this.startEditing}>
                Edit name
              </button>
              <button className="dropdown-item" onClick={this.props.onDelete}>
                Delete dictionary
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
DicitonaryHeader.propTypes = {
  updateDictionary: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { updateDictionary }
)(DicitonaryHeader);
