import React, { Component } from "react";
import classNames from "classnames";

export default class UpdateName extends Component {
  render() {
    return (
      <form className="form-row" onSubmit={this.props.saveEdit}>
        <div className="form-group mr-2">
          <input
            className={classNames("form-control form-control-sm", {
              "is-invalid": this.props.errors.name
            })}
            type="text"
            name="name"
            placeholder="Name"
            value={this.props.name}
            onChange={this.props.onChange}
          />
          {this.props.errors.name && (
            <div className="invalid-feedback">{this.props.errors.name}</div>
          )}
        </div>
        <div className="form-group mr-2">
          <i type="submit" className="fas fa-check" />
        </div>
        <div className="form-group mb-2">
          <i className="fas fa-times" onClick={this.props.stopEditing} />
        </div>
      </form>
    );
  }
}
