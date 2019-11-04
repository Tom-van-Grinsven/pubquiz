import React from 'react'
import ReactDOM from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import mainReducer from './reducers'

import './index.css'
import App from './components/App'


const theStore = createStore(mainReducer,
    applyMiddleware(
        thunkMiddleware
    )
);

const mainComponent = (
    <Provider store={theStore}>
        <App/>
    </Provider>
);

ReactDOM.render(mainComponent, document.getElementById('root'));
