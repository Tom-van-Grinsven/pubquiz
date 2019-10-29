import React from 'react'
import ReactDOM from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import reduxWebsocket from 'react-redux-websocket'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import mainReducer from './reducers/index'

import './index.css'
import App from './components/App'
import {BrowserRouter} from "react-router-dom";


const theStore = createStore(mainReducer,
    applyMiddleware(
        thunkMiddleware
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
