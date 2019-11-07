import {fetchQuiz} from "../reducers/quizReducer";
import {Redirect, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import AnswerQuestion from "./AnswerQuestion";
import QuizEnded from "./QuizEnded";
import React from "react";
import {LoadingComponent, TeamPending, TeamRejected} from "./MiscComponents";
import {getTeamInformation} from "../reducers/teamReducer";
import {setupSocketConnection} from "../reducers/webSocketReducer";

function QuizComponent(props) {

    const loadingComponent = <LoadingComponent text='Loading Quiz Info'/>

    if(!props.quiz.isFetching && (props.match.params.code !== props.quiz.code|| props.quiz.isUpdated)) {
        props.doFetchQuiz(props.match.params.code);
        return loadingComponent;
    }

    if(props.quiz.isFetching) {
        return loadingComponent;
    }

    if(!props.quiz.code) {
        return <Redirect to='/' />
    }

    if(props.quiz.isActive === false) {
        if(!props.quiz.isFetching && props.location.pathname !== '/quiz/' + props.quiz.code + '/thanks-for-playing') {
            return <Redirect to={`/quiz/${props.quiz.code}/thanks-for-playing`} />
        }
    } else {

        if(props.team.isUpdated && !props.team.isFetching) {
            props.doFetchTeam();
            return loadingComponent;
        }

        if(props.team.isFetching || props.quiz.isFetching) {
            return loadingComponent;
        }

        if(props.team.teamName && props.websocket.socket === null && !props.websocket.isClosed){
            props.doSetupSocketConnection()
        }

        if(!props.quiz.isFetching && props.quiz.isOpen === true && props.location.pathname !== '/quiz/' + props.quiz.code + '/team-pending') {
            return <Redirect to={`/quiz/${props.quiz.code}/team-pending`} />
        }

        if(!props.quiz.isFetching && props.quiz.isOpen === false && props.team.teamName && props.location.pathname !== props.match.url) {
            return <Redirect to={props.match.url} />
        }

        if(!props.quiz.isFetching && props.quiz.isOpen === false && !props.team.teamName && props.location.pathname !== '/quiz/' + props.quiz.code + '/team-rejected') {
            return <Redirect to={`/quiz/${props.quiz.code}/team-rejected`} />
        }
    }

    return (
        <Router>
            <Switch>
                <Route exact path={props.match.path} component={AnswerQuestion} />
                <Route exact path={`${props.match.path}/team-pending`} component={TeamPending} />
                <Route exact path={`${props.match.path}/team-rejected`} component={TeamRejected} />
                <Route exact path={`${props.match.path}/thanks-for-playing`} component={QuizEnded} />
            </Switch>
        </Router>
    )
}

const mapStateToProps = (state) => {
    return {
        quiz: state.quiz,
        team: state.team,
        websocket: state.webSocket,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doFetchQuiz: (quizCode) => dispatch(fetchQuiz(quizCode)),
        doFetchTeam: () => dispatch(getTeamInformation()),
        doSetupSocketConnection: () => dispatch(setupSocketConnection())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuizComponent))
