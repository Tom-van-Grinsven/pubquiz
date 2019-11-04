import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Button, ButtonGroup, Card, Collapse} from "react-bootstrap";
import {connect} from "react-redux";
import {toggleSelectedQuestion} from "../reducers/categoryQuestionsReducer";

function QuestionNavCategory(props) {


    if(props.categoryItem.questions.length === 0) {
        return null
    }

    const questionItems = props.categoryItem.questions.map(q => <QuestionNavCategoryQuestion
        key={q._id}
        disabled={props.disabled}
        question={q.question}
        onToggle={() => {props.doToggleSelectedQuestion(q._id)}}
        active={props.selectedQuestionId === q._id}
    />);

    return (
        <Card className='question-nav-category'>
            <Card.Header className='green'>{props.categoryItem.category}</Card.Header>
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

    const [open, setOpen] = useState(false);
    useLayoutEffect(() => setOpen(true));

    return (
        <Collapse in={open} >
            <Button variant="outline-orange" disabled={props.disabled} active={props.active} onClick={props.onToggle} block>{props.question}</Button>
        </Collapse>
    )
}




