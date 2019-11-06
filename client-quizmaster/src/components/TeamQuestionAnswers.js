import React from 'react';
import CurrentQuestionDisplay from "./CurrentQuestionDisplay";
import TeamAnswersList from "./TeamAnswerList";
import {connect} from "react-redux";

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