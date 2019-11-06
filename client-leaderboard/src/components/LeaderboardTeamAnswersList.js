import React from "react";
import {Card, Col, Collapse, Row, Table} from "react-bootstrap";
import {fetchTeamAnswers} from "../reducers/teamAnswersReducer";
import {connect} from "react-redux";

function LeaderboardTeamAnswersList(props) {


    if(props.activeQuestion.question === null) {
        return null;
    }

    if(!props.teamAnswers.isFetching && props.teamAnswers.isUpdated) {
        props.doFetchTeamAnswers(props.quiz.code);
        return null;
    }

    const loadingDiv = (
        <div className='loading-div'>
            <p>Waiting for answers <img width='40px' src={process.env.PUBLIC_URL + '/images/spinner.svg'} alt="spinner" /></p>
        </div>
    );

    let teamAnswersList;
    if(props.teamAnswers.answers.length > 0 ) {
        teamAnswersList = props.teamAnswers.answers.map(teamAnswer => <LeaderboardTeamAnswer
            key={teamAnswer._id}
            answer={teamAnswer}
            isClosed={props.activeQuestion.question.isClosed}
        />)
    }

    let questionAnswer = '';
    if(props.activeQuestion.question.isClosed && props.activeQuestion.question.answer !== undefined && props.activeQuestion.question.isValidated) {
        questionAnswer = <h5 className='text-center'><b>Answer:</b> {props.activeQuestion.question.answer}</h5>
    }

    return (
        <Card>
            <Card.Header className='green text-center'><h5><b>Team Answers</b></h5></Card.Header>
            <Card.Body>
                {questionAnswer}
                <div className='team-answers-list'>
                    {!props.activeQuestion.question.isClosed ? loadingDiv : '' }
                    <Table bordered>
                        <tbody>
                        {!teamAnswersList && props.activeQuestion.question.isClosed ? <tr><td className='text-center'>No Answers we're given by the teams</td></tr> : teamAnswersList }
                        </tbody>
                    </Table>
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
        <tr key={props.answer._id} className={answerStatus}>
            <td>{props.answer.teamName} {!props.isClosed ? 'has given an answer!' : ''}</td>
            {props.isClosed ? <td> {props.answer.givenAnswer} </td> : ''}
        </tr>
    )
}