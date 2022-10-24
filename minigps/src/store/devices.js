import { createSlice } from '@reduxjs/toolkit';

//Tạo 1 slice reuducer như là 1 mảnh nhỏ của root reducer.
// nhận vào một object với createSlice gồm name, initialState, reducer
// reducer là một object 
const { reducer, actions } = createSlice({
  name: 'devices',
  initialState: {
    items: {},
    selectedId: null,
  },
  reducers: {
    refresh(state, action) {
      state.items = {};
      action.payload.forEach((item) => state.items[item.id] = item);
    }, //Tạo ra một action {type: 'devices/refresh'}
    update(state, action) {
      action.payload.forEach((item) => state.items[item.id] = item);
    },
    select(state, action) {
      state.selectedId = action.payload;
    },
    remove(state, action) {
      delete state.items[action.payload];
    },
  },
});

export { actions as devicesActions };
export { reducer as devicesReducer };