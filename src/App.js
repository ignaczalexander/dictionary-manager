import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addDictionary,
  getDictionaries,
  deleteDictionary
} from "./actions/dictActions";
import "./App.css";
import Dictionaries from "./components/Dictionaries";
import Navbar from "./components/navbar/Navbar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      errors: {}
    };
  }
  componentDidMount() {
    this.props.getDictionaries();
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
    const dictData = { name: this.state.name, rows: [{}] };
    this.props.addDictionary(dictData);
    //this.props.deleteDictionary(this.state.name);
  };
  render() {
    const { dicts } = this.props;
    const { errors } = this.state;
    const dictsPlace =
      dicts.length === 0 ? (
        <p className="text-center">You have no dictionaries</p>
      ) : (
        <div>
          <h2>Dictionaries</h2>
          <Dictionaries dictionaries={dicts} />
        </div>
      );
    return (
      <div className="">
        <Navbar />
        <div className="container">
          <div className="row">
            <div className="col-md-10">
              <form onSubmit={this.onSubmit}>
                <div className="form-row">
                  <div className="form-group col">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      placeholder="Dictionary name"
                      onChange={this.onChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback d-block">
                        {errors.name}
                      </div>
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
          </div>
          {dictsPlace}
        </div>
      </div>
    );
  }
}
App.propTypes = {
  addDictionary: PropTypes.func.isRequired,
  getDictionaries: PropTypes.func.isRequired,
  deleteDictionary: PropTypes.func.isRequired,
  dicts: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  dicts: state.dictReducer.dicts,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { addDictionary, getDictionaries, deleteDictionary }
)(App);
