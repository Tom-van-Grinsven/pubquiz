import React from 'react';
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {login, setLoginEmail, setLoginPassword} from "../reducers/loginReducer";
import {withRouter} from "react-router-dom";
import {ErrorComponent, submitOnEnter} from "./MiscComponents";
import {connect} from "react-redux";


function LoginForm(props) {

    const setEmail              = (event) => props.doSetEmail(event.target.value);
    const setPassword           = (event) => props.doSetPassword(event.target.value);
    const login                 = () => props.doLogin(props.email, props.password);
    const doSubmitOnEnter       = (event) => submitOnEnter(login)(event);

    return (
        <Container className='login-register-form'>
            <Card className='green'>
                <Card.Body>
                    <ErrorComponent err={props.err}/>
                    <h3>Quizmaster Login</h3>
                    <Form.Group>
                        <Form.Control type='text' onKeyPress={doSubmitOnEnter} onChange={setEmail} value={props.email} placeholder='example@domain.com'/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type='password' onKeyPress={doSubmitOnEnter} onChange={setPassword} value={props.password} placeholder='password'/>
                    </Form.Group>
                    <Form.Group>
                        <Button variant="primary" onClick={login} block>Login</Button>
                    </Form.Group>
                </Card.Body>
            </Card>
        </Container>
    )
}

function mapStateToProps(state) {
    return {
        err: state.err.login,
        isSending: state.loginRegister.login.isSending,
        email: state.loginRegister.login.email,
        password: state.loginRegister.login.password,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        doSetEmail: (email) => dispatch(setLoginEmail(email)),
        doSetPassword: (password) => dispatch(setLoginPassword(password)),
        doLogin: (email, password) => dispatch(login(email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginForm));
