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


function LeaderBoardContainer(props) {

    const loadingComponent = <div className='quiz-leaderboard'><LoadingComponent text='Loading Quiz Info'/></div>;

    if(!props.quiz.code && !props.quiz.hasFetched && !props.quiz.isFetching || props.quiz.isUpdated) {
        props.doFetchQuiz(props.match.params.code);
        return loadingComponent;
    }

    if(props.quiz.isFetching) {
        return loadingComponent;
    }

    if(!props.quiz.code && props.quiz.hasFetched) {
        return <Redirect to='/'/>
    } else if(props.websocket === null) {
        props.doSetupSocketConnection();
    }

    if(props.quiz.isOpen) {
        return <div className='quiz-leaderboard'><LoadingComponent text='Waiting for Quiz to start'/></div>;
    }

    return (
        <Router>
            <Switch>
                <Route exact path={`${props.match.path}`}>
                    <Row className='quiz-leaderboard'>
                        <Col className='col' md='6'>
                            <CurrentQuestionDisplay/>
                            <LeaderboardTeamAnswersList/>
                        </Col>
                        <Col className='col' md='6'>
                            <Leaderboard/>
                        </Col>
                    </Row>
                </Route>
                <Route path={`${props.match.path}/podium`} component={Podium}/>
            </Switch>
        </Router>
    )

}

const mapStateToProps = (state) => {
    return {
        quiz: state.quiz,
        activeQuestion: state.activeQuestion,
        leaderBoard: state.leaderboard,
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