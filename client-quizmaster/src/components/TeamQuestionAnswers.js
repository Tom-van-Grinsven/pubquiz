import React from 'react';
import {Card} from "react-bootstrap";
import CurrentQuestionDisplay from "./CurrentQuestionDisplay";
import TeamAnswersList from "./TeamAnswerList";
import {connect} from "react-redux";
import {fetchActiveQuestion} from "../reducers/activeQuestionReducer";

function TeamQuestionAnswers(props) {

    return (
        <div className='team-question-answers-container'>
            <CurrentQuestionDisplay/>
            {props.activeQuestion.question !== null ? <TeamAnswersList/> : ''}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        activeQuestion: state.dashboard.activeQuestion
    }
};

export default connect(mapStateToProps)(TeamQuestionAnswers);