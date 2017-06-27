// import { SET } from '../actions/settings';

const initialState = {
  delimiters: {
    thousands: ' ',
    decimal: ',',
  },
};

export default function settings(state = initialState, action) {
  switch (action.type) {
    
    default:
      return state;
  }
}
