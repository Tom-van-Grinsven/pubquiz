import React from 'react'
import ReactDOM from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import mainReducer from './reducers'

import './index.css'
import App from './components/App'
import {BrowserRouter} from "react-router-dom";
import {composeWithDevTools} from "redux-devtools-extension";

const theStore = createStore(mainReducer,
    composeWithDevTools(
        applyMiddleware(
            thunkMiddleware
        )
    )
);

const mainComponent = (
    <Provider store={theStore}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(mainComponent, document.getElementById('root'));
