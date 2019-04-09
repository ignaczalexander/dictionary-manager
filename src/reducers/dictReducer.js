import { ADD_DICTIONARY, GET_DICTIONARIES } from "../actions/types";
const initialState = {
  dicts: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_DICTIONARIES:
      return {
        ...state,
        dicts: action.payload
      };

    case ADD_DICTIONARY:
      return {
        ...state,
        dicts: [...state.dicts, action.payload]
      };

    default:
      return state;
  }
}
