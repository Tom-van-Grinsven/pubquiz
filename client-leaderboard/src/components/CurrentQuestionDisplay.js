import React from "react";
import {connect} from "react-redux";
import {Card, Col, Collapse, Row} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import {fetchActiveQuestion} from "../reducers/activeQuestionReducer";
import { Textfit } from 'react-textfit';

function CurrentQuestionDisplay(props) {

    if(props.activeQuestion.isUpdated && !props.activeQuestion.isFetching) {
        //props.doFetchActiveQuestion(props.match.params.code);
        //return null;
    }

    if(props.activeQuestion.question === null && (!props.activeQuestion.isUpdated || props.activeQuestion.isFetching)) {
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

    //const {question, category} = props.activeQuestion.question;

    return (
        <div className='current-question-display'>
        <Card className='orange text-center'>
            <Card.Body>
                <Row>
                    <Col sm='6' className='text-right'><h5>Round: 4</h5></Col>
                    <Col sm='6' className='text-left'><h5>Question: 4</h5></Col>
                </Row>
                <h5 className='cat-text'><b>Art and Literature</b></h5>
                <Textfit mode="multi" style={{maxHeight: '9vmin'}}>Which famous writer, who used the line `God for Harry, England and St. George!` in one of his works, was said to have been born and died on St George`s Day?</Textfit>
                {/*<Textfit max='18' mode="multi" style={{height: '5vmin'}}>Who wrote Lord of the Rings</Textfit>*/}

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
