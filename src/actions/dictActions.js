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

    dicts.map(dict => evaluateDictionary(dict));
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
    return dispatch({ type: GET_ERRORS, payload: errors });
  }
  dispatch(clearErrors());

  dictData._id = uuidv4();
  dictData.rows = [
    { _id: uuidv4(), domain: "This", range: "that", msg: {} },
    { _id: uuidv4(), domain: "This", range: "that", msg: {} },
    { _id: uuidv4(), domain: "This", range: "that", msg: {} }
  ];
  let dicts = [];

  if (localStorage.getItem("dictionaries")) {
    dicts = JSON.parse(localStorage.getItem("dictionaries"));
  }

  dicts.push(evaluateDictionary(dictData));
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
        //rowData.msg = checkConsistency(dict, rowData);

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
    console.log(rowData);
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
        console.log("next row");
        console.log(nextRow);
        let msg = {};
        if (row.domain === nextRow.domain) {
          //can be duplicate or fork
          if (row.range === nextRow.range) {
            //its a duplicate
            msg.duplicate =
              "DUP: This row maps to the same value as an other in this dictionary";
          } else {
            //its a fork
            msg.fork =
              "FORK: Two rows in the dictionary map to different values";
          }
        }
        if (row.range === nextRow.domain) {
          //can be cycle or chain
          if (row.domain === nextRow.range) {
            msg.cycle =
              "CYCL: Two or more rows in a dictionary result in cycles";
          } else {
            msg.chain =
              "CHAIN: A chain structure in the dictionary (a value in Range column also appears in Domain column of another entry)";
          }
        }
        console.log(row.msg);
        row.msg = { ...row.msg, ...msg };
        console.log(row.msg);
      }
    }
  }
  return dict;
};
