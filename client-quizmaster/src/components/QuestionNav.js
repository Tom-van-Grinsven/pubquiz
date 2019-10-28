import React from 'react';
import {Card} from "react-bootstrap";
import QuestionNavCategory from "./QuestionNavCategory";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {fetchCategoryQuestions, sendActiveQuestion} from "../reducers/categoryQuestionsReducer";

function QuestionNav (props) {

    console.log(props)
    if(props.categoryQuestions.length === 0) {
        props.doFetchCategoryQuestions();
        return null;
    }

    const disabled = props.activeQuestion.question !== null;
    const sendActiveQuestion = () => props.doSendActiveQuestion(props.selectedQuestionId);
    const questionCategories = props.categoryQuestions.map(questionsCategory => <QuestionNavCategory key={questionsCategory.name} disabled={disabled} category={questionsCategory} />);

    console.log(disabled);
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
        selectedQuestionId: state.dashboard.categoryQuestions.selectedQuestionId,
        categoryQuestions: state.dashboard.categoryQuestions.list,
        activeQuestion: state.dashboard.activeQuestion
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doFetchCategoryQuestions: () => dispatch(fetchCategoryQuestions()),
        doSendActiveQuestion: (questionId) => dispatch(sendActiveQuestion(questionId))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuestionNav))

