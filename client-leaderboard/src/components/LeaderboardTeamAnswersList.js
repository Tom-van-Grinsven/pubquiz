import React from "react";
import {Card, Col, Collapse, Row} from "react-bootstrap";
import {fetchTeamAnswers} from "../reducers/teamAnswersReducer";
import {connect} from "react-redux";

function LeaderboardTeamAnswersList(props) {


    if(props.activeQuestion.question === null) {
        return null;
    }

    if(!props.activeQuestion.question.isClosed || props.teamAnswers.isFetching) {
        return (
            <Collapse in={true} appear={true}>
                <div className='current-question-display'>
                    <Card>
                        <Card.Body className='text-center'>
                            <p>Waiting for the Team answers</p>
                            <img width='100px' src={process.env.PUBLIC_URL + '/images/spinner.svg'} alt="spinner" />
                        </Card.Body>
                    </Card>
                </div>
            </Collapse>
        )
    }

    if(!props.teamAnswers.isFetching && props.teamAnswers.isUpdated) {
        props.doFetchTeamAnswers(props.quiz.code);
        return null;
    }

    let teamAnswersList;
    if(props.teamAnswers.answers.length > 0 ) {
        teamAnswersList = props.teamAnswers.answers.map(teamAnswer => <LeaderboardTeamAnswer
            key={teamAnswer._id}
            answer={teamAnswer}
        />)
    }

    let questionAnswer = '';
    if(props.activeQuestion.question.isClosed && props.activeQuestion.question.answer !== undefined && props.activeQuestion.question.isValidated) {
        questionAnswer = <h5 className='text-center'><b>Answer:</b> {props.activeQuestion.question.answer}</h5>
    }

    return (
        <Card className='green'>
            <Card.Body>
                {questionAnswer}
                <div className='team-answers-list'>
                    {teamAnswersList ? teamAnswersList : <h5 className='text-center'>No Answers we're given by the teams</h5>}
                </div>
            </Card.Body>
        </Card>
    )

}

const mapStateToProps = (state) => {
    return {
        quiz: state.quiz,
        activeQuestion: state.activeQuestion,
        teamAnswers: state.teamAnswers
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doFetchTeamAnswers: (quizCode) => dispatch(fetchTeamAnswers(quizCode))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardTeamAnswersList)

function LeaderboardTeamAnswer(props) {

    let answerStatus = '';
    if(props.answer.isRight !== undefined && props.answer.isRight !== null) {
        if(props.answer.isRight) {
            answerStatus = 'correct'
        } else {
            answerStatus = 'incorrect'
        }
    }
    return (
        <Row className='team-answer'>
            <Col xs='5'>{props.answer.teamName}</Col>
            <Col xs='7' className={`text-center ${answerStatus}`}>{props.answer.givenAnswer}</Col>
        </Row>
    )
}