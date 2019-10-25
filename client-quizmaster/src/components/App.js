import React from 'react';
import Container from 'react-bootstrap/Container'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import RegisterLoginContainer from "./RegisterLoginContainer";
import CreateQuizForm from "./CreateQuizForm";
import ApproveTeamContainer from "./ApproveTeamContainer";
import RoundCategorySelect from "./RoundCategorySelect";
import QuizMasterDashboard from "./QuizMasterDashboard";

function App(props) {
  return (
      <Container className='main-content-container'>
        <div className='logo'>
            <img src={process.env.PUBLIC_URL + '/images/logo.png'}  />
        </div>
        <Router>
            <Switch>
                <Route exact path='/' component={RegisterLoginContainer} />
                <Route exact path='/quiz' component={CreateQuizForm}/>
                <Route exact path='/quiz/approve-teams' component={ApproveTeamContainer} />
                <Route exact path='/quiz/select-categories' component={RoundCategorySelect}/>
                <Route exact path='/quiz/dashboard' component={QuizMasterDashboard}/>
            </Switch>
        </Router>
      </Container>
  );
}

export default App;
