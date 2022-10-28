import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tutorialReducer from "../store/tutorialsReducer";

const reducer = combineReducers({
    tutorials: tutorialReducer 
});

const store = configureStore({
    reducer: reducer,
    devTools: true,
});

export default store;