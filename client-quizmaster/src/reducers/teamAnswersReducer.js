import {produce} from "immer";
import {clearActiveQuestion} from "./activeQuestionReducer";

export const fetchTeamAnswers = () => {
    return dispatch => {
        dispatch(fetchTeamAnswersRequest())
        return new Promise((resolve, reject) => {
            resolve([{
                team: 'Team 1',
                answer: 'Geen Idee'
            }, {
                team: 'Team 2',
                answer: 'Geen Idee'
            },  {
                team: 'Team 3',
                answer: 'Geen Idee'
            },  {
                team: 'Team 4',
                answer: 'Geen Idee'
            },  {
                team: 'Team 5',
                answer: 'Geen Idee'
            },  {
                team: 'Team 6',
                answer: 'Geen Idee'
            },  {
                team: 'Team 7',
                answer: 'Geen Idee'
            }, {
                team: 'Team 8',
                answer: 'Geen Idee'
            }])
        }).then(answers => dispatch(fetchTeamAnswersRequestSuccess(answers)), err => dispatch(fetchTeamAnswersRequestFailure(err)))
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

const fetchTeamAnswersRequestFailure = (err) => {
    return {
        type: 'FETCH_TEAM_ANSWERS_REQUEST_FAILURE',
        payload: err,
    }
};

export const setTeamAnswersIsUpdated = (status) => {
    return {
        type: 'TEAM_ANSWERS_IS_UPDATED',
        payload: status
    }
};

export const validateTeamAnswer =(team, status) => {
  return {
      type: 'VALIDATE_TEAM_ANSWER',
      payload: {
          team: team,
          status: status
      }
  }
};



export const sendTeamAnswersValidation = (teamAnswers) => {
    return dispatch => {
        console.log(teamAnswers);
        dispatch(sendTeamAnswersValidationRequest());
        return new Promise((resolve, reject) => {
            resolve(true)
        }).then(() => {
            dispatch(sendTeamAnswersValidationRequestSuccess())
            dispatch(clearActiveQuestion())
        }, err => sendTeamAnswersValidationRequestFailure(err))
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

const sendTeamAnswersValidationRequestFailure = (err) => {
    return {
        type: 'TEAM_ANSWERS_VALIDATION_REQUEST_FAILURE',
        payload: err
    }
};


const initialState = {
    isFetching: false,
    isSending: false,
    isUpdated: false,
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

            //testing purposes
            const length = state.answers.length;
            if(length < 8) {
                state.answers.push(action.payload[length]);
            } else {
                // only this one is needed
                let previousAnswers = state.answers;
                state.answers = action.payload;

                // test
                //action.payload[4].answer = 'Harry';

                state.answers.some((stateTeamAnswer, index) => {
                    previousAnswers.some(previousTeamAnswer => {
                        if(stateTeamAnswer.team === previousTeamAnswer.team && stateTeamAnswer.answer === previousTeamAnswer.answer) {
                            state.answers[index].isRight = previousTeamAnswer.isRight;
                            return true;
                        }
                    })
                })
            }
            return;

        case 'FETCH_TEAM_ANSWERS_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            state.err = action.payload;
            return;

        case 'TEAM_ANSWERS_IS_UPDATED':
            state.isUpdated = action.payload;
            return;

        case 'VALIDATE_TEAM_ANSWER':
            state.answers.forEach((teamAnswer, index) => {
               if(teamAnswer.team === action.payload.team) {
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
            state.err = action.payload;
            return;

        default:
            return state;
    }
}, initialState);