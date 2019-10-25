import React from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {setLoginEmail, setLoginPassword} from "../reducers/loginReducer";
import * as ReactRedux from "react-redux";
import {withRouter} from "react-router-dom";
import {setQuizName} from "../reducers/quizReducer";

function CreateQuizForm(props) {

    const setQuizName = (event) => props.doSetQuizName(event.target.value);
    const createQuiz = () => props.history.push('/quiz/approve-teams');

    return (

            <Card className='orange'>
                <Card.Body>
                    <div className='create-quiz-form-container'>
                    <h3 className='text-center'>Create new Quiz</h3>
                    <Form.Group>
                        <Form.Control type='text' onChange={setQuizName} value={props.quizName} placeholder='Quiz Name'/>
                    </Form.Group>
                    <Form.Group className='text-center'>
                        <Button variant="primary" onClick={createQuiz} size="lg">Create Quiz</Button>
                    </Form.Group>
                    </div>
                </Card.Body>
            </Card>

    )
}

function mapStateToProps(state) {
    return {
        quizName: state.quiz.name
    }
}

function mapDispatchToProps(dispatch) {
    return {
        doSetQuizName: (quizName) => dispatch(setQuizName(quizName)),
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateQuizForm));
