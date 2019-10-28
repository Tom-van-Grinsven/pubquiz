import React from 'react';
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import * as ReactRedux from "react-redux";
import {setLoginEmail, setLoginPassword} from "../reducers/loginReducer";
import {withRouter} from "react-router-dom";


function LoginForm(props) {

    const setEmail      = (event) => props.doSetEmail(event.target.value);
    const setPassword   = (event) => props.doSetPassword(event.target.value);
    const doLogin       = () => props.history.push('/quiz');

    return (
        <Container className='login-register-form'>
            <Card className='green'>
                <Card.Body>
                    <h3>Quizmaster Login</h3>
                    <Form.Group>
                        <Form.Control type='text' onChange={setEmail} value={props.email} placeholder='example@domain.com'/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type='password' onChange={setPassword} value={props.password} placeholder='password'/>
                    </Form.Group>
                    <Form.Group>
                        <Button variant="primary" onClick={doLogin} block>Login</Button>
                    </Form.Group>
                </Card.Body>
            </Card>
        </Container>
    )
}

function mapStateToProps(state) {
    return {
        email: state.loginRegister.login.email,
        password: state.loginRegister.login.password,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        doSetEmail: (email) => dispatch(setLoginEmail(email)),
        doSetPassword: (password) => dispatch(setLoginPassword(password))
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginForm));
