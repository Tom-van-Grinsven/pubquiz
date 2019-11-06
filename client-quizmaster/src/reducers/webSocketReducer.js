import produce from "immer";

export const setupSocketConnection = () => {
    return dispatch => {
        const socket = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);

        socket.onmessage = (event) => {
            dispatch(JSON.parse(event.data));
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