import React from 'react';
import {Card} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {
    fetchTeamAnswers,
    sendTeamAnswersValidation,
    setTeamAnswersIsUpdated,
    validateTeamAnswer
} from "../reducers/teamAnswersReducer";
import {connect} from "react-redux";
import {sendCloseQuestion} from "../reducers/activeQuestionReducer";


function TeamAnswersList(props) {

    const interval = setTimeout(() => {
        if(!props.teamAnswers.isFetching && !props.teamAnswers.isUpdated && !props.activeQuestion.question.closed) {
            props.doTeamAnswersIsUpdated(true)
        }
    }, 5000);

    if(!props.teamAnswers.isFetching && props.teamAnswers.isUpdated) {
        props.doFetchTeamAnswers();
    }

    let teamAnswers = '';
    if(props.teamAnswers.answers.length > 0) {

        const validateAnswer = (team, status) => props.doValidateAnswer(team, status);

        let index = 0;
        teamAnswers = props.teamAnswers.answers.map(teamAnswer => <ValidateTeamAnswerForm
            validateAnswer={validateAnswer}
            key={teamAnswer.team}
            index={++index}
            teamAnswer={teamAnswer}
        />)
    }

    const loadingDiv = (
        <div className='loading-div'>
            <p>Waiting for answers <img width='40px' src={process.env.PUBLIC_URL + '/images/spinner.svg'} alt="spinner" /></p>
        </div>
    );

    const closeActiveQuestion = () => props.doSendCloseQuestion();
    const sendAnswerValidation = () => {
        const teamAnswers = props.teamAnswers.answers.map(answer => {
            return {
                team: answer.team,
                isRight: answer.isRight
            }
        });
        props.doSendAnswerValidation(teamAnswers);
    };

    return (
        <Card className='team-answers-list'>
            <Card.Header className='green'>
                Team Answers
            </Card.Header>
            <Card.Body>

                {!props.activeQuestion.question.closed ? loadingDiv : ''}

                {teamAnswers}

                <Form.Group className='text-center'>
                    {props.activeQuestion.question.closed ? <Button onClick={sendAnswerValidation} variant="success">Validate Answers</Button> :
                        <Button onClick={closeActiveQuestion} variant="danger">Close Question</Button>}
                </Form.Group>
            </Card.Body>
        </Card>

    )
}

const mapStateToProps = (state) => {
    return {
        activeQuestion: state.dashboard.activeQuestion,
        teamAnswers: state.dashboard.teamAnswers
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doSendAnswerValidation: (teamAnswers) => dispatch(sendTeamAnswersValidation(teamAnswers)),
        doSendCloseQuestion: () => dispatch(sendCloseQuestion()),
        doTeamAnswersIsUpdated: (status) => dispatch(setTeamAnswersIsUpdated(status)),
        doFetchTeamAnswers: () => dispatch(fetchTeamAnswers()),
        doValidateAnswer: (team, status) => dispatch(validateTeamAnswer(team,status))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamAnswersList);


function ValidateTeamAnswerForm(props) {
    return (
        <div className='approve-answer-form'>
            <p>Team {props.index}: {props.teamAnswer.answer}</p>
            <ButtonGroup>
                <Button onClick={() => props.validateAnswer(props.teamAnswer.team, true)} active={props.teamAnswer.isRight !== undefined && props.teamAnswer.isRight} variant="outline-success">✓</Button>
                <Button onClick={() => props.validateAnswer(props.teamAnswer.team, false)} active={props.teamAnswer.isRight !== undefined && !props.teamAnswer.isRight} variant="outline-danger">✗</Button>
            </ButtonGroup>
        </div>
    )
}


