import React from "react";
import CurrentQuestionDisplay from "./CurrentQuestionDisplay";
import LeaderboardTeamAnswersList from "./LeaderboardTeamAnswersList";
import Leaderboard from "./Leaderboard";
import {Col, Row} from "react-bootstrap";
import {fetchQuiz} from "../reducers/quizReducer";
import {connect} from "react-redux";
import {LoadingComponent} from "./MiscComponents";
import {BrowserRouter as Router, Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {setupSocketConnection} from "../reducers/webSocketReducer";
import Podium from "./Podium";
import Logo from "./Logo";


function LeaderBoardContainer(props) {

    if(props.quiz.isOpen) {
        return (
            <div>
                <Logo />
                <div className='quiz-leaderboard'><LoadingComponent text='Waiting for Quiz to start'/></div>;
            </div>
        )
    }


    return (
        <Row className='quiz-leaderboard'>
            <Col className='col' md='7'>
                <CurrentQuestionDisplay/>
                <LeaderboardTeamAnswersList/>
            </Col>
            <Col className='col' md='5'>
                <Leaderboard/>
            </Col>
        </Row>
    )

}

const mapStateToProps = (state) => {
    return {
        quiz: state.quiz,
        activeQuestion: state.activeQuestion,
        websocket: state.websocket.socket
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doFetchQuiz: (quizCode) => dispatch(fetchQuiz(quizCode)),
        doSetupSocketConnection: () => dispatch(setupSocketConnection())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LeaderBoardContainer))