import {Button, Card, Col, Collapse, Row} from "react-bootstrap";
import React from "react";
import {connect} from "react-redux";
import Timer from "react-compound-timer";
import TimerComponent from "./TimerComponent";

function CurrentQuestionDisplay(props) {

    let content;
    if((props.activeQuestion.question === null || props.activeQuestion.question.isValidated) && (!props.activeQuestion.isUpdated || props.activeQuestion.isFetching)) {
        content = (
            <Collapse in={true} appear={true}>
                <div className='current-question-display'>
                    <Card>
                        <Card.Body className='text-center'>
                            <p>{props.activeQuestion.isFetching ? 'Fetching Question' : 'Waiting for question'}</p>
                            <img width='100px' src={process.env.PUBLIC_URL + '/images/spinner.svg'} alt="spinner" />
                        </Card.Body>
                    </Card>
                </div>
            </Collapse>
        )
    } else {

        const {question, category, answer, timer, timestamp} = props.activeQuestion.question;

        content = (
            <div>
                <TimerComponent activeQuestion={props.activeQuestion} />
                <Collapse in={true} appear={true}>
                    <Card className='current-question-display'>
                        <Card.Header className='green'>
                            {category}
                        </Card.Header>
                        <Card.Body>
                            <p><b>Question:</b><br/> {question}</p>
                            <p><b>Answer:</b> {answer}</p>
                        </Card.Body>
                    </Card>
                </Collapse>
            </div>

        )
    }

    return (
        <div>
            <Row className='quiz-round-info'>
                <Col sm='6'>
                    <Card className='orange text-center'>
                        <Card.Body>
                            <b>Round: {props.quiz.roundNr}</b>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm='6'>
                    <Card className='orange text-center'>
                        <Card.Body>
                            <b>Question: {props.quiz.questionNr}</b>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {content}

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        quiz: state.quiz,
        activeQuestion: state.dashboard.activeQuestion,
    }
};



export default connect(mapStateToProps)(CurrentQuestionDisplay);