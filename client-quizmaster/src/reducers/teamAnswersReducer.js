import {produce} from "immer";
import {clearActiveQuestion} from "./activeQuestionReducer";
import {clearError, setError} from "./errorReducer";

export const fetchTeamAnswers = (quizCode) => {
    return dispatch => {
        dispatch(clearError);
        dispatch(fetchTeamAnswersRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/active-questions/answers', {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json(), err => {
            dispatch(fetchTeamAnswersRequestFailure(err));
            dispatch(setError({
                message: [err]
            }));
        }).then(answers => dispatch(fetchTeamAnswersRequestSuccess(answers)), err => {
            dispatch(fetchTeamAnswersRequestFailure(err));
            dispatch(setError({
                message: [err]
            }));
        })
    }
};

const fetchTeamAnswersRequest = () => {
    return {
        type: 'FETCH_TEAM_ANSWERS_REQUEST'
    }
};

const fetchTeamAnswersRequestSuccess = (answers) => {
    return {
        type: 'FETCH_TEAM_ANSWERS_REQUEST_SUCCESS',
        payload: answers
    }
};

const fetchTeamAnswersRequestFailure = () => {
    return {
        type: 'FETCH_TEAM_ANSWERS_REQUEST_FAILURE',
    }
};

export const validateTeamAnswer =(teamId, status) => {
  return {
      type: 'VALIDATE_TEAM_ANSWER',
      payload: {
          teamId: teamId,
          status: status
      }
  }
};

export const sendTeamAnswersValidation = (teamAnswers, quizCode) => {
    return dispatch => {
        console.log(teamAnswers);
        // dispatch(clearError());
        // dispatch(sendTeamAnswersValidationRequest());
        // fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/active-questions/answers', {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'Application/JSON'
        //     },
        //     credentials: 'include',
        //     body: JSON.stringify(teamAnswers)
        // }).then(() => {
        //     dispatch(sendTeamAnswersValidationRequestSuccess());
        //     dispatch(clearActiveQuestion())
        // }, err => {
        //     sendTeamAnswersValidationRequestFailure(err)
        //     dispatch(setError({
        //         message: [err]
        //     }));
        // })
    }
};

const sendTeamAnswersValidationRequest = () => {
    return {
        type: 'TEAM_ANSWERS_VALIDATION_REQUEST'
    }
};

const sendTeamAnswersValidationRequestSuccess = () => {
    return {
        type: 'TEAM_ANSWERS_VALIDATION_REQUEST_SUCCESS'
    }
};

const sendTeamAnswersValidationRequestFailure = () => {
    return {
        type: 'TEAM_ANSWERS_VALIDATION_REQUEST_FAILURE',
    }
};


const initialState = {
    isFetching: false,
    isSending: false,
    isUpdated: true,
    answers: []
};

export const teamAnswersReducer = produce((state, action) => {
    switch (action.type) {

        case 'FETCH_TEAM_ANSWERS_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_TEAM_ANSWERS_REQUEST_SUCCESS':
            state.isFetching = false;
            state.isUpdated = false;

            let previousAnswers = state.answers;
            state.answers = action.payload.answers;
            state.answers.some((stateTeamAnswer, index) => {
                previousAnswers.some(previousTeamAnswer => {
                    if(stateTeamAnswer._id === previousTeamAnswer._id && stateTeamAnswer.givenAnswer === previousTeamAnswer.givenAnswer) {
                        state.answers[index].isRight = previousTeamAnswer.isRight;
                        return true;
                    }
                })
            });
            return;

        case 'FETCH_TEAM_ANSWERS_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            return;

        case 'UPDATE_GIVEN_TEAM_ANSWERS':
            state.isUpdated = true;
            return;

        case 'VALIDATE_TEAM_ANSWER':
            state.answers.forEach((teamAnswer, index) => {
               if(teamAnswer._id === action.payload.teamId) {
                   state.answers[index].isRight = action.payload.status
               }
            });
            return;

        case 'TEAM_ANSWERS_VALIDATION_REQUEST':
            state.isSending = true;
            return;

        case 'TEAM_ANSWERS_VALIDATION_REQUEST_SUCCESS':
            state.isSending = false;
            state.answers = [];
            return;

        case 'TEAM_ANSWERS_VALIDATION_REQUEST_FAILURE':
            state.isSending = false;
            return;

        default:
            return state;
    }
}, initialState);