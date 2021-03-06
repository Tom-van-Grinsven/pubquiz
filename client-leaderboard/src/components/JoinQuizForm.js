import React from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";
import {Collapse} from "react-bootstrap";
import {ErrorComponent} from "./MiscComponents";
import {joinQuiz, setQuizCode} from "../reducers/joinQuizReducer";



function JoinQuizForm(props) {

    const setQuizCode = (event) => props.doSetQuizCode(event.target.value);

    let err;
    if((!props.quiz.code && props.quiz.hasFetched) || (props.quiz.hasFetched && !props.quiz.isActive)) {
        err = {
            messages: ["Sorry it looks like the quiz you tried to join is not available"]
        }
    }

    if(props.quiz.code && props.quiz.isActive) {
        return <Redirect to={`/${props.quiz.code}/leaderboard`}/>
    }

    const joinQuiz = () => props.doJoinQuiz(props.quizCode);

    return (
        <Card className='orange'>
            <Collapse in={true} appear={true}>
                <Card.Body>
                    <div className='join-quiz-form-container'>
                        <h3 className='text-center'>Join Quiz</h3>
                        <ErrorComponent err={err}/>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                value={props.quizCode}
                                onChange={setQuizCode}
                                placeholder='Quiz Code'
                            />
                        </Form.Group>
                        <Form.Group className='text-center'>
                            <Button variant="primary"
                                    onClick={joinQuiz}
                                    size="lg">Join Quiz
                            </Button>
                        </Form.Group>
                    </div>
                </Card.Body>
            </Collapse>
        </Card>
    )
}

const mapStateToProps = (state) => {
    return {
        quizCode: state.joinQuiz.quizCode,
        quiz: state.quiz
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doSetQuizCode: (quizCode) => dispatch(setQuizCode(quizCode)),
        doJoinQuiz: (quizCode) => dispatch(joinQuiz(quizCode)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(JoinQuizForm));
