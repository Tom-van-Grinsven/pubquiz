import React from 'react'
import ReactDOM from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import {BrowserRouter as Router} from "react-router-dom";
import mainReducer from './reducers/index'

import './index.css'
import App from './components/App'

const theStore = createStore(mainReducer,
    composeWithDevTools(
        applyMiddleware(
            thunkMiddleware
        )
    )
);

const mainComponent = (
    <Provider store={theStore}>
        <Router>
            <App/>
        </Router>
    </Provider>
);

ReactDOM.render(mainComponent, document.getElementById('root'));
