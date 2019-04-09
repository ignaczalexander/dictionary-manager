import React, { Component } from "react";
import Dictionary from "./Dictionary";

export default class Dictionaries extends Component {
  render() {
    const { dictionaries } = this.props;

    let dictList = [];
    dictList = dictionaries.map(dict => (
      <Dictionary key={dict._id} dictionary={dict} />
    ));
    return <div>{dictList}</div>;
  }
}
