import React from 'react';
import Container from 'react-bootstrap/Container'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import RegisterLoginContainer from "./RegisterLoginContainer";

function App(props) {
  return (
      <Container className='main-content-container'>
        <Router>
            <Switch>
                <Route exact path='/' component={RegisterLoginContainer} />
            </Switch>
        </Router>
      </Container>
  );
}

export default App;
