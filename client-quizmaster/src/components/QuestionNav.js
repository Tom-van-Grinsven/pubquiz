import React from 'react';
import {Card, Collapse} from "react-bootstrap";
import QuestionNavCategory from "./QuestionNavCategory";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {fetchCategoryQuestions, sendActiveQuestion} from "../reducers/categoryQuestionsReducer";
import {countRemainingQuestions} from "./MiscComponents";

function QuestionNav (props) {


    const numberOfRemainingQuestions = countRemainingQuestions(props.categoryQuestions);

    const disabled = props.activeQuestion.question !== null && !props.activeQuestion.question.isValidated;
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
        categoryQuestions: state.dashboard.categoryQuestions.list,
        activeQuestion: state.dashboard.activeQuestion
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doSendActiveQuestion: (questionId, quizCode) => dispatch(sendActiveQuestion(questionId, quizCode))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuestionNav))

