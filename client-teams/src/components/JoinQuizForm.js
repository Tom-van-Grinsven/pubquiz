import React from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {ErrorComponent} from "./MiscComponents";
import {Collapse} from "react-bootstrap";
import {joinQuiz, setQuizCode, setTeamName} from "../reducers/joinQuizReducer";



function JoinQuizForm(props) {

    const setQuizCode = (event) => props.doSetQuizCode(event.target.value);
    const setTeamName = (event) => props.doSetTeamName(event.target.value);
    const joinQuiz = () => props.doJoinQuiz(props.quizCode, props.teamName, props.history);

    return (
        <Card className='orange'>
            <Collapse in={true} appear={true}>
                <Card.Body>
                    <div className='join-quiz-form-container'>
                        <h3 className='text-center'>Join Quiz</h3>
                        <ErrorComponent err={props.err}/>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                value={props.quizCode}
                                onChange={setQuizCode}
                                placeholder='Quiz Code'
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                value={props.teamName}
                                onChange={setTeamName}
                                placeholder='Team Name'
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
        teamName: state.joinQuiz.teamName,
        quizCode: state.joinQuiz.quizCode
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doSetQuizCode: (quizCode) => dispatch(setQuizCode(quizCode)),
        doSetTeamName: (teamName) => dispatch(setTeamName(teamName)),
        doJoinQuiz: (quizCode, teamName, history) => dispatch(joinQuiz(quizCode, teamName, history)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(JoinQuizForm));
