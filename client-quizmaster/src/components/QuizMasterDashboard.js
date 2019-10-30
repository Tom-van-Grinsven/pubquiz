import React, {useEffect, useRef, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import QuestionNav from "./QuestionNav";
import TeamQuestionAnswers from "./TeamQuestionAnswers";
import {fetchActiveQuestion} from "../reducers/activeQuestionReducer";
import {connect} from "react-redux";

function QuizMasterDashboard(props) {

    if(props.activeQuestion.isUpdated && !props.activeQuestion.isFetching) {
        props.doFetchActiveQuestion(props.quizCode);
        return null;
    }

    return (
        <Row className='quiz-master-dashboard' >
            <Col className='col' md='4'><QuestionNav/></Col>
            <Col className='col' md='8'><TeamQuestionAnswers/></Col>
        </Row>
    )


}

const mapStateToProps = (state) => {
    return {
        quizCode: state.quiz.code,
        activeQuestion: state.dashboard.activeQuestion,
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        doFetchActiveQuestion: (quizCode) => dispatch(fetchActiveQuestion(quizCode))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizMasterDashboard)