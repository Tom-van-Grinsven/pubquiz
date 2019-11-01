import React from "react";
import AnswerQuestionForm from './AnswerQuestionForm';
import CurrentQuestionDisplay from './CurrentQuestionDisplay';
import {connect} from "react-redux";
import _ from 'lodash';
import {Redirect, withRouter} from "react-router-dom";
import {getTeamInformation} from "../reducers/answerQuestionReducer";
import {LoadingComponent} from "./MiscComponents";
import {setupSocketConnection} from "../reducers/webSocketReducer";

function AnswerQuestion(props) {
    const loadingComponent = <LoadingComponent text='Loading Quiz Info'/>

    if(props.hasFetched === false){
        console.log(props.hasFetched);
        if(!props.isFetching && (_.isEmpty(props.teamName) || _.isEmpty(props.quizCode))) {
            props.doFetchTeam();
        }
        return loadingComponent;
    } else {
        if(!props.isFetching && (_.isEmpty(props.teamName) || _.isEmpty(props.quizCode))) {
            return <Redirect to='/'/>
        }
    }

    if((props.quizCode && props.teamName) && props.websocket === null){
        props.doSetupSocketConnection()
    }

    return(
        <div className='answer-question-container'>
            <CurrentQuestionDisplay/>
            <AnswerQuestionForm/>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        isSending: state.answerQuestion.isSending,
        isFetching: state.answerQuestion.isFetching,
        hasFetched: state.answerQuestion.hasFetched,
        teamName: state.answerQuestion.teamName,
        quizCode: state.answerQuestion.quizCode,
        websocket: state.webSocket.socket
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doFetchTeam: () => dispatch(getTeamInformation()),
        doSetupSocketConnection: () => dispatch(setupSocketConnection())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnswerQuestion));
