import React from 'react';
import {Container} from "react-bootstrap";
import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom'
import JoinQuizForm from "./JoinQuizForm";
import Logo from "./Logo";
import QuizComponent from "./QuizComponent";

function App(props) {

    return (
        <Container fluid className='main-content-container'>
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <Logo />
                        <JoinQuizForm/>
                    </Route>
                    <Route path='/:code' component={QuizComponent} />
                </Switch>
            </Router>
        </Container>
    );
}

export default withRouter(App);
