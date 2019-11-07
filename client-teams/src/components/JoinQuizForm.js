import React from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {ErrorComponent, submitOnEnter} from "./MiscComponents";
import {Collapse} from "react-bootstrap";
import {joinQuiz, setQuizCode, setTeamName} from "../reducers/joinQuizReducer";

function JoinQuizForm(props) {

    const setQuizCode = (event) => props.doSetQuizCode(event.target.value);
    const setTeamName = (event) => props.doSetTeamName(event.target.value);
    const joinQuizCallback = (quizCode) => props.history.push('/quiz/' + quizCode + '/team-pending');
    const joinQuiz = () => props.doJoinQuiz(props.quizCode, props.teamName, joinQuizCallback);
    const doSubmitOnEnter   = (event) => submitOnEnter(joinQuiz)(event);

    if((props.quizCode && props.teamName) && props.websocket === null){
        props.doSetupSocketConnection()
    }

    return (
        <Card className='orange'>
            <Collapse in={true} appear={true}>
                <Card.Body>
                    <div className='join-quiz-form-container'>
                        <h3 className='text-center'>Join Quiz</h3>
                        <ErrorComponent err={props.err.joinquiz}/>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                value={props.quizCode}
                                onChange={setQuizCode}
                                onKeyPress={doSubmitOnEnter}
                                placeholder='Quiz Code'
                                className={props.err.code === 'QUIZ_CODE' ? 'error' : ''}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                value={props.teamName}
                                onChange={setTeamName}
                                onKeyPress={doSubmitOnEnter}
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
        err: state.err,
        teamName: state.joinQuiz.teamName,
        quizCode: state.joinQuiz.quizCode
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doSetQuizCode: (quizCode) => dispatch(setQuizCode(quizCode)),
        doSetTeamName: (teamName) => dispatch(setTeamName(teamName)),
        doJoinQuiz: (quizCode, teamName, callback) => dispatch(joinQuiz(quizCode, teamName, callback)),}
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(JoinQuizForm));
