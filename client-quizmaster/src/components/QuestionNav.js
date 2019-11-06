import React from 'react';
import {Card, Col, Collapse, FormControl, InputGroup, Row} from "react-bootstrap";
import QuestionNavCategory from "./QuestionNavCategory";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {sendActiveQuestion, setTimerInput} from "../reducers/categoryQuestionsReducer";

function QuestionNav (props) {


    const disabled              = props.activeQuestion.question !== null && !props.activeQuestion.question.isValidated;
    const categoryQuestions     = formatQuizQuestion(filterQuizQuestions(props.questions));
    const questionCategories    = categoryQuestions.map(categoryItem => <QuestionNavCategory key={categoryItem.category} disabled={disabled} categoryItem={categoryItem} />);

    return (

        <Card className='question-nav'>
            <Card.Body className='question-category-nav-container'>
                {questionCategories}
            </Card.Body>
            <Card.Footer>
                <ActivateQuestionForm {...props} disabled={disabled}/>
            </Card.Footer>
        </Card>

    )
}

const ActivateQuestionForm = (props) => {

    if(props.disabled) {
        return null
    }

    const sendActiveQuestion    = () => props.doSendActiveQuestion(props.selectedQuestionId, props.quizCode, props.timerInput);
    const setTimerInput         = (event) => props.doSetTimerInput(event.target.value);

    return (
        <div>
            <Row>
                <Col xs={{ span: 10, offset: 1 }}>
                    <Form.Group >
                        <h5 className='text-center'>Question answer Timer</h5>
                        <InputGroup className="mb-3">
                            <FormControl value={props.timerInput} onChange={setTimerInput} type='number'/>
                            <InputGroup.Append>
                                <InputGroup.Text>Seconds</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className='text-center'>
                <Button onClick={sendActiveQuestion} variant="primary">Activate Question</Button>
            </Form.Group>
        </div>
    )

};

const mapStateToProps = (state) => {
    return {
        quizCode: state.quiz.code,
        selectedQuestionId: state.dashboard.categoryQuestions.selectedQuestionId,
        questions: state.dashboard.categoryQuestions.list,
        activeQuestion: state.dashboard.activeQuestion,
        timerInput: state.dashboard.categoryQuestions.timerInput,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doSendActiveQuestion: (questionId, quizCode, seconds) => dispatch(sendActiveQuestion(questionId, quizCode, seconds)),
        doSetTimerInput: (value) => dispatch(setTimerInput(value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuestionNav))




export const filterQuizQuestions = (quizQuestions) => {
    return quizQuestions.filter(question => !question.isActive && !question.isClosed && !question.isValidated)
};


export const formatQuizQuestion = (quizQuestions) => {
  return quizQuestions.reduce((acc, q) => {
        let cat = acc.find(el => el.category === q.category);
        if(!cat) {
            cat = {
                category: q.category,
                questions: []
            };
            acc.push(cat)
        }
        cat.questions.push({
            _id: q._id,
            question: q.question
        });
        return acc;
    }, []);
};