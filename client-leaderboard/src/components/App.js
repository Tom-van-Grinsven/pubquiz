import React from 'react';
import {Container} from "react-bootstrap";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import JoinQuizForm from "./JoinQuizForm";
import LeaderBoardContainer from "./LeaderBoardContainer";

function App(props) {
    return (
        <Container fluid className='main-content-container'>
            <Router>
                <Switch>
                    <Route exact path='/' component={JoinQuizForm}/>
                    <Route path='/:code/leaderboard' component={LeaderBoardContainer} />
                </Switch>
            </Router>

        </Container>
    );
}

export default App;
