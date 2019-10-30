import React, {useEffect, useRef, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import QuestionNav from "./QuestionNav";
import TeamQuestionAnswers from "./TeamQuestionAnswers";
import {fetchActiveQuestion} from "../reducers/activeQuestionReducer";
import {connect} from "react-redux";
import {fetchCategoryQuestions} from "../reducers/categoryQuestionsReducer";
import {countRemainingQuestions} from "./MiscComponents";
import {Redirect, withRouter} from "react-router-dom";

function QuizMasterDashboard(props) {

    if(props.activeQuestion.isUpdated && !props.activeQuestion.isFetching) {
        props.doFetchActiveQuestion(props.quiz.code);
        return null;
    }

    if(props.categoryQuestions.isUpdated && !props.categoryQuestions.isFetching) {
        props.doFetchCategoryQuestions(props.quiz.code);
        return null;
    }

    let offset = 0;
    const remainingQuestions = countRemainingQuestions(props.categoryQuestions.list);
    if(remainingQuestions === 0) {
        offset = 2;
    }

    if(!props.activeQuestion.isUpdated && !props.activeQuestion.isFetching) {
        if(props.quiz.questionNr === 12 && remainingQuestions === 0 && props.activeQuestion.question && props.activeQuestion.question.isValidated) {
            return <Redirect to={'/quiz/' + props.quiz.code + '/select-categories'} />
        }
    }

    return (
        <Row className='quiz-master-dashboard' >
            {remainingQuestions > 0  ? <Col className='col' md='4'><QuestionNav/></Col> : '' }
            <Col className='col' md={{ span: 8, offset: offset }}><TeamQuestionAnswers/></Col>
        </Row>
    )
}


const mapStateToProps = (state) => {
    return {
        quiz: state.quiz,
        activeQuestion: state.dashboard.activeQuestion,
        categoryQuestions: state.dashboard.categoryQuestions,
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        doFetchCategoryQuestions: (quizCode) => dispatch(fetchCategoryQuestions(quizCode)),
        doFetchActiveQuestion: (quizCode) => dispatch(fetchActiveQuestion(quizCode))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuizMasterDashboard))