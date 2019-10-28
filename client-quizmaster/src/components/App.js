import React from 'react';
import Container from 'react-bootstrap/Container'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import RegisterLoginContainer from "./RegisterLoginContainer";
import CreateQuizForm from "./CreateQuizForm";
import QuizComponent from "./QuizComponent";


function App(props) {
    console.log(props)

  return (
      <Container className='main-content-container'>
        <div className='logo'>
            <img src={process.env.PUBLIC_URL + '/images/logo.png'}  />
        </div>
        <Router>
            <Switch>
                <Route exact path='/' component={RegisterLoginContainer} />
                <Route exact path='/quiz' component={CreateQuizForm}/>
                <Route path='/quiz/:code' component={QuizComponent} />
            </Switch>
        </Router>
      </Container>
  );
}


export default App;
