import React from "react";
import {connect} from "react-redux";
import {Card, Collapse} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import {fetchActiveQuestion} from "../reducers/activeQuestionReducer";

function CurrentQuestionDisplay(props) {

    if(props.activeQuestion.isUpdated && !props.activeQuestion.isFetching) {
        props.doFetchActiveQuestion('qhhhnt');
        return null;
    }

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

    const {question, category} = props.activeQuestion.question;

    return (
        <div className='current-question-display'>
        <Card className='category-card purple text-center'>
            <Card.Body>
                <h3><b>{category}</b></h3>
            </Card.Body>
        </Card>
        <Card className='current-question-display green text-center'>
            <Card.Body>
            <h3><b>Question:</b></h3>
                <h5>{question}</h5>
            </Card.Body>
        </Card>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
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
