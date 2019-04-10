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
import {
  DUPLICATE_ERROR,
  FORK_ERROR,
  CYCLE_ERROR,
  CHAIN_ERROR
} from "../utils/errors";
const uuidv4 = require("uuid/v4");

//get all dictionaries
export const getDictionaries = () => dispatch => {
  if (localStorage.getItem("dictionaries")) {
    const dicts = JSON.parse(localStorage.getItem("dictionaries"));
    dicts.map(dict => evaluateDictionary(dict));
    dispatch({ type: GET_DICTIONARIES, payload: dicts });
  } else {
    dispatch({ type: GET_DICTIONARIES, payload: [] });
  }
};

//create a dictionary
export const addDictionary = dictData => dispatch => {
  const { errors, isValid } = validateAddDictionary(dictData);

  if (!isValid) {
    return dispatch({ type: GET_ERRORS, payload: errors });
  }
  dispatch(clearErrors());

  dictData._id = uuidv4();

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
    return dispatch({
      type: GET_ERRORS,
      payload: { add_row: errors, dict_id }
    });
  }
  dispatch(clearErrors());

  if (localStorage.getItem("dictionaries")) {
    rowData._id = uuidv4();
    rowData.msg = {};
    const dicts = JSON.parse(localStorage.getItem("dictionaries")).map(dict => {
      if (dict._id === dict_id) {
        dict.rows.push(rowData);
      }
      return evaluateDictionary(dict);
    });
    localStorage.setItem("dictionaries", JSON.stringify(dicts));
    dispatch({ type: GET_DICTIONARIES, payload: dicts });
  }
};

//update a row in a dictionary
export const updateDictRow = (dict_id, row_id, rowData) => dispatch => {
  const { errors, isValid } = validateAddRow(rowData);

  if (!isValid) {
    return dispatch({
      type: GET_ERRORS,
      payload: { update_row: errors, row_id }
    });
  }
  dispatch(clearErrors());
  if (localStorage.getItem("dictionaries")) {
    rowData._id = uuidv4();
    const dicts = JSON.parse(localStorage.getItem("dictionaries")).map(dict => {
      if (dict._id === dict_id) {
        dict.rows = dict.rows.map(row => {
          if (row._id === row_id) {
            row = rowData;
          }
          return row;
        });
      }
      return evaluateDictionary(dict);
    });
    localStorage.setItem("dictionaries", JSON.stringify(dicts));
    dispatch({ type: GET_DICTIONARIES, payload: dicts });
  }
};

//update dictionary name
export const updateDictionary = (dict_id, dictData) => dispatch => {
  const { errors, isValid } = validateAddDictionary(dictData);

  if (!isValid) {
    return dispatch({
      type: GET_ERRORS,
      payload: { update_dict: errors, dict_id }
    });
  }
  dispatch(clearErrors());

  if (localStorage.getItem("dictionaries")) {
    const dicts = JSON.parse(localStorage.getItem("dictionaries")).map(dict => {
      if (dict._id === dict_id) {
        dict.name = dictData.name;
      }
      return dict;
    });
    localStorage.setItem("dictionaries", JSON.stringify(dicts));
    dispatch({ type: GET_DICTIONARIES, payload: dicts });
  }
};

//delete row from dictionary
export const deleteDictRow = (dict_id, row_id) => dispatch => {
  if (localStorage.getItem("dictionaries")) {
    const dicts = JSON.parse(localStorage.getItem("dictionaries")).map(dict => {
      if (dict._id === dict_id) {
        dict.rows = dict.rows.filter(row => row._id !== row_id);
      }
      return evaluateDictionary(dict);
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

const evaluateDictionary = dict => {
  //nested for loop to compare each row with each other
  for (let i = 0; i < dict.rows.length; i++) {
    const row = dict.rows[i];
    row.msg = {};
    for (let j = 0; j < dict.rows.length; j++) {
      const nextRow = dict.rows[j];
      if (nextRow._id !== row._id) {
        let msg = {};
        if (row.domain === nextRow.domain) {
          //can be duplicate or fork
          if (row.range === nextRow.range) {
            //its a duplicate
            msg.duplicate = DUPLICATE_ERROR;
          } else {
            //its a fork
            msg.fork = FORK_ERROR;
          }
        }
        if (row.range === nextRow.domain) {
          //can be cycle or chain
          if (row.domain === nextRow.range) {
            msg.cycle = CYCLE_ERROR;
          } else {
            msg.chain = CHAIN_ERROR;
          }
        }
        row.msg = { ...row.msg, ...msg };
      }
    }
  }
  return dict;
};
