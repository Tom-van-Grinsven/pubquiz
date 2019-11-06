import React from "react";
import {BrowserRouter as Router, Switch, Route, withRouter, Redirect} from 'react-router-dom'
import LeaderBoardContainer from "./LeaderBoardContainer";
import Podium from "./Podium";
import {fetchQuiz} from "../reducers/quizReducer";
import {setupSocketConnection} from "../reducers/webSocketReducer";
import {connect} from "react-redux";
import {LoadingComponent} from "./MiscComponents";


function QuizComponent(props) {

    const loadingComponent = <div className='quiz-leaderboard'><LoadingComponent text='Loading Quiz Info'/></div>;

    if((!props.quiz.code && !props.quiz.hasFetched) || (!props.quiz.isFetching && props.quiz.isUpdated)) {
        props.doFetchQuiz(props.match.params.code);
        return loadingComponent;
    }

    if(props.quiz.isFetching) {
        return loadingComponent;
    }

    if(!props.quiz.code && props.quiz.hasFetched) {
        return <Redirect to='/'/>
    }

    if(props.quiz.isActive === false && props.location.pathname !== '/' + props.quiz.code + '/podium') {
        return <Redirect to={`/${props.quiz.code}/podium`} />
    }

    if(props.websocket === null) {
        props.doSetupSocketConnection();
    }

    return (
        <div>
            <Router>
                <Switch>
                    <Route path={`${props.match.path}/leaderboard`} component={LeaderBoardContainer} />
                    <Route path={`${props.match.path}/podium`} component={Podium}/>
                </Switch>
            </Router>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuizComponent))

