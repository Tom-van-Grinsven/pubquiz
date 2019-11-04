import React from 'react';
import {Card} from "react-bootstrap";
import CurrentQuestionDisplay from "./CurrentQuestionDisplay";
import TeamAnswersList from "./TeamAnswerList";
import {connect} from "react-redux";
import {fetchActiveQuestion} from "../reducers/activeQuestionReducer";

function TeamQuestionAnswers(props) {


    const showTeamAnswers = (props.activeQuestion.question !== null && !props.activeQuestion.question.isValidated);

    return (
        <div className='team-question-answers-container'>
            <CurrentQuestionDisplay/>
            {showTeamAnswers ? <TeamAnswersList/> : ''}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        activeQuestion: state.dashboard.activeQuestion
    }
};

export default connect(mapStateToProps)(TeamQuestionAnswers);