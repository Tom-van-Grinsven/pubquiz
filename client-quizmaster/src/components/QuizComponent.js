import {connect} from "react-redux";
import {BrowserRouter as Router, Switch, Route, withRouter, Redirect} from 'react-router-dom'
import ApproveTeamContainer from "./ApproveTeamContainer";
import RoundCategorySelect from "./RoundCategorySelect";
import QuizMasterDashboard from "./QuizMasterDashboard";
import React from "react";
import {fetchQuiz} from "../reducers/quizReducer";
import {LoadingComponent} from "./MiscComponents";
import {setupSocketConnection} from "../reducers/webSocketReducer";
import QuizEnded from "./QuizEnded";


function QuizComponent(props) {

    const loadingComponent = <LoadingComponent text='Loading Quiz Info'/>

    if(!props.quiz.isFetching && (props.match.params.code !== props.quiz.code|| props.quiz.isUpdated)) {
        props.doFetchQuiz(props.match.params.code);
        return loadingComponent;
    }

    if(props.quiz.isFetching) {
        return loadingComponent;
    }

    if(props.quiz.code && props.websocket === null) {
        props.doSetupSocketConnection();
    }

    if(props.quiz.isActive === false && props.location.pathname !== props.match.url + '/thanks-for-playing') {
        return <Redirect to={`${props.match.url}/thanks-for-playing`} />
    } else if(props.location.pathname === props.match.url) {
        if(props.quiz.isOpen) {
            return <Redirect to={`${props.location.pathname}/approve-teams`} />
        } else {
            return <Redirect to={`${props.location.pathname}/dashboard`} />
        }
    }

    return (
        <div>
            <Router>
                <Switch>
                    <Route path={`${props.match.path}/approve-teams`} component={ApproveTeamContainer} />
                    <Route path={`${props.match.path}/select-categories`} component={RoundCategorySelect}/>
                    <Route path={`${props.match.path}/dashboard`}  component={QuizMasterDashboard} />
                    <Route path={`${props.match.path}/thanks-for-playing`} component={QuizEnded} />
                </Switch>
            </Router>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        categoryQuestions: state.dashboard.categoryQuestions,
        activeQuestion: state.dashboard.activeQuestion,
        websocket: state.websocket.socket,
        quiz: state.quiz
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doFetchQuiz: (quizCode) => dispatch(fetchQuiz(quizCode)),
        doSetupSocketConnection: () => dispatch(setupSocketConnection())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuizComponent));