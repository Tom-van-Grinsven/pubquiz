import produce from "immer";

export const setupSocketConnection = () => {
    return dispatch => {
        const socket = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);

        socket.onmessage = (event) => {
            dispatch(JSON.parse(event.data));
        };

        socket.onerror = () => {
            dispatch(socketError('Problems connecting to server, please try again'))
        };

        socket.onclose = () => {
            dispatch(socketClose())
        };
        dispatch(attachSocket(socket));
    }
};

const socketError = (err) => {
    return {
        type: 'SOCKET_ERROR',
        payload: err
    }
};

const socketClose = () => {
    return {
        type: 'SOCKET_CLOSE'
    }
};

const attachSocket = (socket) => {
    return {
        type: 'ATTACH_SOCKET',
        payload: socket
    }
};

const initialState = {
    socket: null,
    isClosed: false,
    err: null,
};

export const webSocketReducer = produce((state, action) => {

    switch(action.type) {

        case 'ATTACH_SOCKET':
            state.socket    = action.payload;
            state.isClosed  = false;
            state.err       = null;
            return;

        case 'SOCKET_CLOSE':
            state.socket = null;
            state.isClosed = true;
            return;

        default:
            return state;

    }

}, initialState);