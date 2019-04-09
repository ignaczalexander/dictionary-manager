import {
  ADD_DICTIONARY,
  GET_DICTIONARIES,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";
import {
  validateAddDictionary,
  validateAddRow
} from "../validation/dictionary";
const uuidv4 = require("uuid/v4");

//get all dictionaries
export const getDictionaries = () => dispatch => {
  if (localStorage.getItem("dictionaries")) {
    console.log(" dicts in storage");

    const dicts = JSON.parse(localStorage.getItem("dictionaries"));
    console.log(dicts);

    dispatch({ type: GET_DICTIONARIES, payload: dicts });
  } else {
    console.log("no dicts in storage");

    dispatch({ type: GET_DICTIONARIES, payload: [] });
  }
};

//create a dictionary
export const addDictionary = dictData => dispatch => {
  const { errors, isValid } = validateAddDictionary(dictData);

  if (!isValid) {
    console.log(errors);

    return dispatch({ type: GET_ERRORS, payload: errors });
  }
  dispatch(clearErrors());

  dictData._id = uuidv4();
  dictData.rows = [
    { _id: uuidv4(), domain: "This", range: "that" },
    { _id: uuidv4(), domain: "This", range: "that" },
    { _id: uuidv4(), domain: "This", range: "that" }
  ];
  let dicts = [];

  if (localStorage.getItem("dictionaries")) {
    dicts = JSON.parse(localStorage.getItem("dictionaries"));
  }

  dicts.push(dictData);
  localStorage.setItem("dictionaries", JSON.stringify(dicts));

  dispatch({ type: ADD_DICTIONARY, payload: dictData });
};

//delete a dictionary
export const deleteDictionary = dict_id => dispatch => {
  if (localStorage.getItem("dictionaries")) {
    const dicts = JSON.parse(localStorage.getItem("dictionaries")).filter(
      item => item._id !== dict_id
    );
    localStorage.setItem("dictionaries", JSON.stringify(dicts));
    dispatch({ type: GET_DICTIONARIES, payload: dicts });
  }
};

//add row to dictionary
export const addDictRow = (dict_id, rowData) => dispatch => {
  const { errors, isValid } = validateAddRow(rowData);

  if (!isValid) {
    return dispatch({ type: GET_ERRORS, payload: errors });
  }
  dispatch(clearErrors());

  if (localStorage.getItem("dictionaries")) {
    rowData._id = uuidv4();
    const dicts = JSON.parse(localStorage.getItem("dictionaries")).map(dict => {
      if (dict._id === dict_id) {
        dict.rows.push(rowData);
      }
      return dict;
    });
    localStorage.setItem("dictionaries", JSON.stringify(dicts));
    dispatch({ type: GET_DICTIONARIES, payload: dicts });
  }
};

//update a row in a dictionary
export const updateDictRow = (dict_id, row_id, rowData) => dispatch => {
  const { errors, isValid } = validateAddRow(rowData);

  if (!isValid) {
    return dispatch({ type: GET_ERRORS, payload: { row: errors } });
  }
  dispatch(clearErrors());
  if (localStorage.getItem("dictionaries")) {
    rowData._id = uuidv4();
    console.log(rowData);
    const dicts = JSON.parse(localStorage.getItem("dictionaries")).map(dict => {
      if (dict._id === dict_id) {
        dict.rows = dict.rows.map(row => {
          if (row._id === row_id) {
            console.log("got the row");
            console.log(row);
            console.log(rowData);
            row = rowData;
            console.log(row);
          }
          return row;
        });
      }
      return dict;
    });
    console.log(dicts);

    localStorage.setItem("dictionaries", JSON.stringify(dicts));
    dispatch({ type: GET_DICTIONARIES, payload: dicts });
  }
};

//delete row from dictionary
export const deleteDictRow = (dict_id, row_id) => dispatch => {
  if (localStorage.getItem("dictionaries")) {
    const dicts = JSON.parse(localStorage.getItem("dictionaries")).map(item => {
      if (item._id === dict_id) {
        item.rows = item.rows.filter(row => row._id !== row_id);
      }
      return item;
    });
    localStorage.setItem("dictionaries", JSON.stringify(dicts));
    dispatch({ type: GET_DICTIONARIES, payload: dicts });
  }
};

//clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
