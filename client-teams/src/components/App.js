import React from 'react';
import Container from 'react-bootstrap/Container'
import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom'
import JoinQuizForm from './JoinQuizForm'
import AnswerQuestion from './AnswerQuestion';

function App(props) {
    let content;

    content = (
        <Router>
            <Switch>
                <Route exact path='/' component={JoinQuizForm} />
                <Route path='/quiz/:code' component={AnswerQuestion} />
            </Switch>
        </Router>
    );

  return (
      <Container className='main-content-container'>
        <div className='logo'>
          <img src={process.env.PUBLIC_URL + '/images/logo.png'}  />
        </div>
          {content}
      </Container>
  );
}

export default App;
