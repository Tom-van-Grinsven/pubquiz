import {connect} from "react-redux";
import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom'
import ApproveTeamContainer from "./ApproveTeamContainer";
import RoundCategorySelect from "./RoundCategorySelect";
import QuizMasterDashboard from "./QuizMasterDashboard";
import React from "react";
import {fetchQuiz} from "../reducers/quizReducer";
import Card from "react-bootstrap/Card";
import ApproveTeamList from "./ApproveTeamList";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {LoadingComponent} from "./MiscComponents";
import {setupSocketConnection} from "../reducers/webSocketReducer";
import {Col, Row} from "react-bootstrap";


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

    return (
        <div>
            <Router>
                <Switch>
                    <Route path={`${props.match.path}/approve-teams`} component={ApproveTeamContainer} />
                    <Route path={`${props.match.path}/select-categories`} component={RoundCategorySelect}/>
                    <Route path={`${props.match.path}/dashboard`}  component={QuizMasterDashboard} />>
                </Switch>
            </Router>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
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