import React from "react";
import {ErrorComponent, submitOnEnter} from "./MiscComponents";
import {Collapse} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {fetchTeamAnswers, sendAnswer, setAnswer} from "../reducers/answerQuestionReducer";

function AnswerQuestionForm(props) {

    const {answer, isRight, isUpdated, isFetching, isSending} = props.answerQuestion;

    const setAnswer = (event) => props.doSetAnswer(event.target.value);
    const sendAnswer = () => props.doSendAnswer(props.quizCode, answer);
    const doSubmitOnEnter = (event) => submitOnEnter(sendAnswer)(event);

    if(props.activeQuestion === null){
        return null;
    }

    if(isUpdated && !isFetching) {
        props.doFetchAnswer(props.quizCode, props.teamName);
    }

    let correct = '';
    if(props.activeQuestion.isValidated && !isUpdated) {
        correct = isRight ? 'correct' : 'incorrect'
    }

    return (
        <Card className='orange'>
            <Collapse in={true} appear={true}>
                <Card.Body>
                    <div className='answer-question-form-container'>
                        <h3 className='text-center'><b>Answer</b></h3>
                        <ErrorComponent err={props.err}/>
                        <Form.Group>
                            <Form.Control
                                className={correct}
                                type='text'
                                onKeyPress={doSubmitOnEnter}
                                onChange={setAnswer}
                                value={answer}
                                placeholder='Answer'
                                readOnly={
                                    !!props.activeQuestion.isClosed
                                }
                            />
                        </Form.Group>
                        <Form.Group className='text-center'>
                            <Button variant="primary"
                                    onClick={sendAnswer}
                                    size="lg"
                                    disabled={!!props.activeQuestion.isClosed}
                            >
                                {props.activeQuestion.isClosed ? "Question is Closed" : "Submit Answer"}
                                {isSending ? <span className="right-icon loading">&nbsp;</span> : '' }
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
        teamName: state.team.teamName,
        team: state.team,
        answerQuestion: state.answerQuestion,
        quizCode: state.quiz.code,
        activeQuestion: state.activeQuestion.question,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doSetAnswer: (answer) => dispatch(setAnswer(answer)),
        doSendAnswer: (quizCode, answer) => dispatch(sendAnswer(quizCode, answer)),
        doFetchAnswer: (quizCode, teamName) => dispatch(fetchTeamAnswers(quizCode, teamName))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnswerQuestionForm));