import React from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import * as ReactRedux from "react-redux";
import {withRouter} from "react-router-dom";
import {createQuiz, setQuizName} from "../reducers/quizReducer";
import {ErrorComponent} from "./MiscComponents";
import {Collapse} from "react-bootstrap";

function CreateQuizForm(props) {

    const setQuizName = (event) => props.doSetQuizName(event.target.value);
    const createQuiz = () => props.doCreateQuiz(props.quizName, props.history);

    return (
        <Card className='orange'>
            <Collapse in='true' appear='true'>
                <Card.Body>
                    <div className='create-quiz-form-container'>
                        <h3 className='text-center'>Create new Quiz</h3>
                        <ErrorComponent err={props.err}/>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                onChange={setQuizName}
                                value={props.quizName}
                                placeholder='Quiz Name'
                                className={props.err.code === 'QUIZ_NAME' ? 'error' : ''}
                            />
                        </Form.Group>
                        <Form.Group className='text-center'>
                            <Button variant="primary" onClick={createQuiz} size="lg">Create Quiz
                                {props.isSending ? '<span className="right-icon loading">&nbsp;</span>' : '' }</Button>
                        </Form.Group>
                    </div>
                </Card.Body>
            </Collapse>
        </Card>
    )
}

function mapStateToProps(state) {
    return {
        err: state.err,
        isSending: false,
        quizName: state.quiz.nameInput
    }
}

function mapDispatchToProps(dispatch) {
    return {
        doCreateQuiz: (quizName, history) => dispatch(createQuiz(quizName, history)),
        doSetQuizName: (quizName) => dispatch(setQuizName(quizName)),

    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateQuizForm));
