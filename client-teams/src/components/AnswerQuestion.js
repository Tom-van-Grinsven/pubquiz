import {Button, Card, Collapse} from "react-bootstrap";
import React from "react";
import {withRouter} from "react-router-dom";
import AnswerQuestionForm from './AnswerQuestionForm';
import CurrentQuestionDisplay from './CurrentQuestionDisplay';

function AnswerQuestion(props) {

    return(
        <div className='answer-question-container'>
            <CurrentQuestionDisplay/>
            <AnswerQuestionForm/>
        </div>
        )
}

export default AnswerQuestion;
