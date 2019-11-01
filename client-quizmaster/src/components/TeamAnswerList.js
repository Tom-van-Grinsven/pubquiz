import React from 'react';
import {Card, Collapse} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {
    fetchTeamAnswers,
    sendTeamAnswersValidation,
    validateTeamAnswer
} from "../reducers/teamAnswersReducer";
import {connect} from "react-redux";
import {sendCloseQuestion} from "../reducers/activeQuestionReducer";
import {ErrorComponent} from "./MiscComponents";


function TeamAnswersList(props) {

    if(!props.teamAnswers.isFetching && props.teamAnswers.isUpdated) {
        props.doFetchTeamAnswers(props.quizCode);
    }

    let teamAnswers = '';
    if(props.teamAnswers.answers.length > 0) {

        const validateAnswer = (teamId, status) => props.doValidateAnswer(teamId, status);

        let index = 0;
        teamAnswers = props.teamAnswers.answers.map(teamAnswer => <ValidateTeamAnswerForm
            validateAnswer={validateAnswer}
            key={teamAnswer._id}
            index={++index}
            teamAnswer={teamAnswer}
        />)
    }

    const loadingDiv = (
        <div className='loading-div'>
            <p>Waiting for answers <img width='40px' src={process.env.PUBLIC_URL + '/images/spinner.svg'} alt="spinner" /></p>
        </div>
    );

    const closeActiveQuestion = () => props.doSendCloseQuestion(props.quizCode);
    const sendAnswerValidation = () => {
        const teamAnswers = props.teamAnswers.answers.map(answer => {
            return {
                teamName: answer.teamName,
                isRight: answer.isRight
            }
        });
        props.doSendAnswerValidation(teamAnswers, props.quizCode);
    };

    return (
        <Card className='team-answers-list'>
            <Card.Header className='green'>
                Team Answers
            </Card.Header>
            <Card.Body>

                {!props.activeQuestion.question.isClosed ? loadingDiv : ''}

                {teamAnswers}
                <ErrorComponent err={props.err.teamAnswers} />

                <Form.Group className='text-center'>
                    {props.activeQuestion.question.isClosed ? <Button onClick={sendAnswerValidation} variant="success">Validate Answers</Button> :
                        <Button onClick={closeActiveQuestion} variant="danger">Close Question</Button>}
                </Form.Group>
            </Card.Body>
        </Card>

    )
}

const mapStateToProps = (state) => {
    return {
        err: state.err,
        quizCode: state.quiz.code,
        activeQuestion: state.dashboard.activeQuestion,
        teamAnswers: state.dashboard.teamAnswers
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doSendAnswerValidation: (teamAnswers, quizCode) => dispatch(sendTeamAnswersValidation(teamAnswers, quizCode)),
        doSendCloseQuestion: (quizCode) => dispatch(sendCloseQuestion(quizCode)),
        doFetchTeamAnswers: (quizCode) => dispatch(fetchTeamAnswers(quizCode)),
        doValidateAnswer: (teamId, status) => dispatch(validateTeamAnswer(teamId, status))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamAnswersList);


function ValidateTeamAnswerForm(props) {
    return (
        <Collapse in={true} appear={true}>
            <div className='approve-answer-form'>
                <p>Team {props.index}: {props.teamAnswer.givenAnswer}</p>
                <ButtonGroup>
                    <Button
                        onClick={() => props.validateAnswer(props.teamAnswer._id, true)}
                        active={props.teamAnswer.isRight !== null && props.teamAnswer.isRight}
                        variant="outline-success"
                    >✓</Button>

                    <Button
                        onClick={() => props.validateAnswer(props.teamAnswer._id, false)}
                        active={props.teamAnswer.isRight !== null && !props.teamAnswer.isRight}
                        variant="outline-danger"
                    >✗</Button>
                </ButtonGroup>
            </div>
        </Collapse>
    )
}


