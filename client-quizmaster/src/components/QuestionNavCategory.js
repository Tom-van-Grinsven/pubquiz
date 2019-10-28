import React from 'react';
import {Button, ButtonGroup, Card} from "react-bootstrap";
import {connect} from "react-redux";
import {toggleSelectedQuestion} from "../reducers/categoryQuestionsReducer";

function QuestionNavCategory(props) {

    const questionItems = props.category.questions.map(q => <QuestionNavCategoryQuestion
        key={q.id}
        disabled={props.disabled}
        question={q.question}
        onToggle={() => {console.log(q.id); props.doToggleSelectedQuestion(q.id)}}
        active={props.selectedQuestionId === q.id}
    />);

    return (
        <Card className='question-nav-category'>
            <Card.Header className='green'>{props.category.name}</Card.Header>
            <Card.Body className='no-padding d-flex'>
                <ButtonGroup vertical>
                    {questionItems}
                </ButtonGroup>
            </Card.Body>
        </Card>
    )
}

const mapStateToProps = (state) => {
    return {
        selectedQuestionId: state.dashboard.categoryQuestions.selectedQuestionId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doToggleSelectedQuestion: (questionId) => dispatch(toggleSelectedQuestion(questionId))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionNavCategory);

function QuestionNavCategoryQuestion(props) {
    return (
        <Button variant="outline-orange" disabled={props.disabled} active={props.active} onClick={props.onToggle} block>{props.question}</Button>
    )
}




