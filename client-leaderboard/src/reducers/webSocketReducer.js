import produce from "immer";
import {setError} from "./errorReducer";

export const setupSocketConnection = () => {
    return dispatch => {
        const socket = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);
        socket.onerror = (event) => {
            //console.log('Error!!!');
        };
        socket.onopen = (event) => {
            //console.log('YESSS')
        };
        socket.onmessage = (event) => {
            console.log(event.data);
            dispatch(JSON.parse(event.data));
        };
        socket.onclose = (event) => {
            //console.log('close');
        };

        dispatch(attachSocket(socket));
    }
};

const attachSocket = (socket) => {
    return {
        type: 'ATTACH_SOCKET',
        payload: socket
    }
};

const closeSocket = (socket) => {
    return {
        type: 'CLOSE_SOCKET',
    }
};

const initialState = {
    socket: null,
};

export const webSocketReducer = produce((state, action) => {

    switch(action.type) {

        case 'CLOSE_SOCKET':
            state.socket.close();
            state.socket = null
            return state;

        case 'ATTACH_SOCKET':
            state.socket = action.payload;
            return state;

        default:
            return state;

    }

}, initialState);