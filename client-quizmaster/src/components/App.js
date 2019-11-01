import React from 'react';
import Container from 'react-bootstrap/Container'
import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom'
import RegisterLoginContainer from "./RegisterLoginContainer";
import CreateQuizForm from "./CreateQuizForm";
import QuizComponent from "./QuizComponent";
import {fetchAccount} from "../reducers/accountReducer";
import {connect} from "react-redux";
import {ErrorComponent, LoadingComponent} from "./MiscComponents";
import LoginForm from "./LoginForm";


function App(props) {

    let content;
    if(!props.account.isFetching && props.account.isUpdated) {
        props.doFetchAccount();
        return null

    }

    if (props.account.isLoggedIn && props.location.pathname === '/') {
        props.history.push('/quiz');
        return null
    }

    if(!props.account.isFetching && !props.account.isLoggedIn && props.location.pathname !== '/') {
        const err = {
            messages: ['Protected Content! Please login to your account in order to access it']
        };
        content = (
            <div>
                <ErrorComponent err={err} />
                <LoginForm />
            </div>
        )

    } else if(props.account.isFetching || props.account.isUpdated) {
        content = <LoadingComponent text='Loading...'/>;

    } else {
        content = (
            <Router>
                <Switch>
                    <Route exact path='/' component={RegisterLoginContainer} />
                    <Route exact path='/quiz' component={CreateQuizForm}/>
                    <Route path='/quiz/:code' component={QuizComponent} />
                </Switch>
            </Router>
        )
    }



    return (
        <Container fluid className='main-content-container'>
            <div className='logo'>
                <img src={process.env.PUBLIC_URL + '/images/logo.png'}  />
            </div>
            {content}
        </Container>
    );
}

const mapStateToProps = (state) => {
    return {
        account: state.account
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doFetchAccount: () => dispatch(fetchAccount())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
