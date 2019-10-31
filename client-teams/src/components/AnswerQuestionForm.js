import React from "react";
import {ErrorComponent} from "./MiscComponents";
import {Collapse} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {sendAnswer, setAnswer} from "../reducers/answerQuestionReducer";

function AnswerQuestionForm(props) {

    const setAnswer = (event) => props.doSetAnswer(event.target.value);
    const sendAnswer = () => props.doSendAnswer(props.quizCode, props.teamName, props.answer);

    if(props.activeQuestion === null){
        return null;
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
                                type='text'
                                onChange={setAnswer}
                                value={props.answer}
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
                                {props.isSending ? <span className="right-icon loading">&nbsp;</span> : '' }
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
        teamName: state.answerQuestion.teamName,
        answer: state.answerQuestion.answer,
        quizCode: state.answerQuestion.quizCode,
        activeQuestion: state.activeQuestion.question,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doSetAnswer: (answer) => dispatch(setAnswer(answer)),
        doSendAnswer: (quizCode, teamName, answer) => dispatch(sendAnswer(quizCode, teamName, answer)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnswerQuestionForm));