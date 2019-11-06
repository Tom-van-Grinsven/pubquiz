import React from "react";
import {connect} from "react-redux";
import {Card, Col, Collapse, Row} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import {fetchActiveQuestion} from "../reducers/activeQuestionReducer";

function CurrentQuestionDisplay(props) {

    if(props.activeQuestion.isUpdated && !props.activeQuestion.isFetching) {
        props.doFetchActiveQuestion(props.quiz.code);
        return null;
    }

    if(props.activeQuestion.question === null && (!props.activeQuestion.isUpdated || props.activeQuestion.isFetching)) {
        return (
            <Collapse in={true} appear={true}>
                <div className='current-question-display'>
                    <Card>
                        <Card.Body className='text-center'>
                            <p>Waiting for question</p>
                            <img width='100px' src={process.env.PUBLIC_URL + '/images/spinner.svg'} alt="spinner" />
                        </Card.Body>
                    </Card>
                </div>
            </Collapse>
        )
    }

    const {question, category} = props.activeQuestion.question;

    return (
        <div className='current-question-display'>
        <Card className='orange text-center'>
            <Card.Body>
                <Row>
                    <Col sm='6' className='text-right'><h5>Round: {props.activeQuestion.question.roundNr}</h5></Col>
                    <Col sm='6' className='text-left'><h5>Question: {props.activeQuestion.question.questionNr}</h5></Col>
                </Row>
                <h5 className='cat-text'><b>{category}</b></h5>
                <h5>{question}</h5>
            </Card.Body>
        </Card>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        quiz: state.quiz,
        activeQuestion: state.activeQuestion,
        quizCode: state.joinQuiz.quizCode
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doFetchActiveQuestion: (quizCode) => dispatch(fetchActiveQuestion(quizCode))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CurrentQuestionDisplay));
