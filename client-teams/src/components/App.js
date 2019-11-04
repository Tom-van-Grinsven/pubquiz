import React from 'react';
import Container from 'react-bootstrap/Container'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import JoinQuizForm from './JoinQuizForm'
import AnswerQuestion from './AnswerQuestion';
import QuizEnded from './QuizEnded';

function App(props) {
    let content;

    content = (
        <Router>
            <Switch>
                <Route exact path='/' component={JoinQuizForm} />
                <Route exact path='/quiz/:code' component={AnswerQuestion} />
                <Route exact path="/quiz/:code/thanksforplaying" component={QuizEnded} />
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
