import React from 'react';
import Container from 'react-bootstrap/Container'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import RegisterLoginContainer from "./RegisterLoginContainer";
import CreateQuizForm from "./CreateQuizForm";

function App(props) {
  return (
      <Container className='main-content-container'>
        <Router>
            <Switch>
                <Route exact path='/' component={RegisterLoginContainer} />
                <Route path='/quiz' component={CreateQuizForm}/>
                <Route path='/quiz/approve-teams'/>
                <Route path='/quiz/select-categories'/>
                <Route path='/quiz/dashboard'/>
            </Switch>
        </Router>
      </Container>
  );
}

export default App;
