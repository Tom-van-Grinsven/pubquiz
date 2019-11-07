import React from 'react';
import Container from 'react-bootstrap/Container'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import JoinQuizForm from './JoinQuizForm'
import QuizComponent from "./QuizComponent";

function App(props) {
    let content;

    content = (
        <Router>
            <Switch>
                <Route exact path={['/', '/:code']} component={JoinQuizForm} />
                <Route path='/quiz/:code' component={QuizComponent} />
            </Switch>
        </Router>
    );

  return (
      <Container fluid className='main-content-container'>
        <div className='logo'>
          <img src={process.env.PUBLIC_URL + '/images/logo.png'}   alt="Oops"/>
        </div>
          {content}
      </Container>
  );
}

export default App;
