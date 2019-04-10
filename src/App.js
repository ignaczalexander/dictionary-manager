import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getDictionaries } from "./actions/dictActions";
import Dictionaries from "./components/Dictionaries";
import Navbar from "./components/navbar/Navbar";
import AddDictionary from "./components/AddDictionary";

class App extends Component {
  componentDidMount() {
    this.props.getDictionaries();
  }

  render() {
    const { dicts } = this.props;
    const dictsPlace =
      dicts.length === 0 ? (
        <p className="text-center">You have no dictionaries</p>
      ) : (
        <div>
          <h3 className="mb-3">Dictionaries</h3>
          <Dictionaries dictionaries={dicts} />
        </div>
      );
    return (
      <div>
        <Navbar />
        <div className="container p-3">
          <AddDictionary />
          {dictsPlace}
        </div>
      </div>
    );
  }
}
App.propTypes = {
  getDictionaries: PropTypes.func.isRequired,
  dicts: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  dicts: state.dictReducer.dicts,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { getDictionaries }
)(App);
