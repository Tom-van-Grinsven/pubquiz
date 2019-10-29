import React from 'react';
import {Card, Collapse} from "react-bootstrap";
import QuestionNavCategory from "./QuestionNavCategory";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {fetchCategoryQuestions, sendActiveQuestion} from "../reducers/categoryQuestionsReducer";

function QuestionNav (props) {

    if(props.categoryQuestions.length === 0 && !props.isFetching) {
        props.doFetchCategoryQuestions(props.quizCode);
        return null;
    }

    const disabled = props.activeQuestion.question !== null;
    const sendActiveQuestion = () => props.doSendActiveQuestion(props.selectedQuestionId, props.quizCode);
    const questionCategories = props.categoryQuestions.map(categoryItem => <QuestionNavCategory key={categoryItem.category} disabled={disabled} categoryItem={categoryItem} />);

    return (
        <Card className='question-nav'>
            <Card.Body className='question-category-nav-container'>
                {questionCategories}
            </Card.Body>
            <Card.Footer>
                <Form.Group className='text-center'>
                    {!disabled ? <Button onClick={sendActiveQuestion} variant="primary">Activate Question</Button> : '' }
                </Form.Group>
            </Card.Footer>
        </Card>
    )
}

const mapStateToProps = (state) => {
    return {
        quizCode: state.quiz.code,
        selectedQuestionId: state.dashboard.categoryQuestions.selectedQuestionId,
        isFetching: state.dashboard.categoryQuestions.isFetching,
        categoryQuestions: state.dashboard.categoryQuestions.list,
        activeQuestion: state.dashboard.activeQuestion
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doFetchCategoryQuestions: (quizCode) => dispatch(fetchCategoryQuestions(quizCode)),
        doSendActiveQuestion: (questionId, quizCode) => dispatch(sendActiveQuestion(questionId, quizCode))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuestionNav))

