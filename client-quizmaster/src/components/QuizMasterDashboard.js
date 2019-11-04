import React from 'react';
import {Col, Row} from "react-bootstrap";
import QuestionNav, {filterQuizQuestions} from "./QuestionNav";
import TeamQuestionAnswers from "./TeamQuestionAnswers";
import {fetchActiveQuestion} from "../reducers/activeQuestionReducer";
import {connect} from "react-redux";
import {fetchCategoryQuestions} from "../reducers/categoryQuestionsReducer";
import {countRemainingQuestions} from "./MiscComponents";
import {Redirect, withRouter} from "react-router-dom";

function QuizMasterDashboard(props) {

    if(props.activeQuestion.isUpdated && !props.activeQuestion.isFetching) {
        props.doFetchActiveQuestion(props.quiz.code);
    }

    if(props.categoryQuestions.isUpdated && !props.categoryQuestions.isFetching) {
        props.doFetchCategoryQuestions(props.quiz.code);
    }

    let offset = 0;
    if(filterQuizQuestions(props.categoryQuestions.list).length === 0 && props.activeQuestion.question) {
        offset = 2;
    }

    if(!props.categoryQuestions.isUpdated && !props.categoryQuestions.isFetching) {
        if (props.categoryQuestions.list.length > 0 && countRemainingQuestions(props.categoryQuestions.list) === 0) {
            return <Redirect to={'/quiz/' + props.quiz.code + '/select-categories'}/>
        }
    }

    return (
        <Row className='quiz-master-dashboard' >
            {offset === 0  ? <Col className='col' md='4'><QuestionNav/></Col> : '' }
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