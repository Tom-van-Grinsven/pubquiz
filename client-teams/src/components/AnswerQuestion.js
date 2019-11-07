import React from "react";
import AnswerQuestionForm from './AnswerQuestionForm';
import CurrentQuestionDisplay from './CurrentQuestionDisplay';

function AnswerQuestion() {

    return(
        <div className='answer-question-container'>
            <CurrentQuestionDisplay/>
            <AnswerQuestionForm/>
        </div>
    )

}


export default AnswerQuestion;
