import {Button, Card, Collapse} from "react-bootstrap";
import React from "react";
import {fetchActiveQuestion} from "../reducers/activeQuestionReducer";
import {connect} from "react-redux";

function CurrentQuestionDisplay(props) {

    if(props.activeQuestion.question === null && !props.activeQuestion.isUpdated || props.activeQuestion.isFetching) {
        return (
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
    }

    const {question, category, answer} = props.activeQuestion.question;

    return (
        <Card className='current-question-display'>
            <Card.Header className='green'>
                {category}
            </Card.Header>
            <Card.Body>
                <p><b>Question:</b><br/> {question}</p>
                <p><b>Answer:</b> {answer}</p>
            </Card.Body>
        </Card>
    )
}

const mapStateToProps = (state) => {
    return {
        quizCode: state.quiz.code,
        activeQuestion: state.dashboard.activeQuestion,
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        doFetchActiveQuestion: (quizCode) => dispatch(fetchActiveQuestion(quizCode))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrentQuestionDisplay);