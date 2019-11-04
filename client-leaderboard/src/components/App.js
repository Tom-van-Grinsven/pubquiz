import React from 'react';
import {Container} from "react-bootstrap";
import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom'
import JoinQuizForm from "./JoinQuizForm";
import LeaderBoardContainer from "./LeaderBoardContainer";
import Podium from "./Podium";

function App(props) {

    return (
        <Container fluid className='main-content-container'>
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <div className='logo'>
                            <img src={process.env.PUBLIC_URL + '/images/logo.png'}  />
                        </div>
                        <JoinQuizForm/>
                    </Route>
                    <Route path='/:code/leaderboard' component={LeaderBoardContainer} />

                </Switch>
            </Router>
        </Container>
    );
}

export default withRouter(App);
