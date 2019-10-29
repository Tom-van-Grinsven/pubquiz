import React from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import * as ReactRedux from "react-redux";
import {withRouter} from "react-router-dom";
import {registerAccount, setRegisterEmail, setRegisterPassword} from "../reducers/registerReducer";


function RegisterForm(props) {

    const setEmail      = (event) => props.doSetEmail(event.target.value);
    const setPassword   = (event) => props.doSetPassword(event.target.value);
    const doRegister    = (email, password, history) => props.doRegisterAccount(email, password, history);

    return (
        <Container className='login-register-form'>
            <Card className='purple'>
                <Card.Body>
                    <h3>Quizmaster Register</h3>
                    <Form.Group>
                        <Form.Control type='text' onChange={setEmail} value={props.email} placeholder='example@domain.com'/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type='password' onChange={setPassword} value={props.password} placeholder='password'/>
                    </Form.Group>
                    <Form.Group>
                        <Button variant="primary" onClick={doRegister} block>Register</Button>
                    </Form.Group>
                </Card.Body>
            </Card>
        </Container>
    )
}

function mapStateToProps(state) {
    return {
        email: '',
        password: '',
    }
}

function mapDispatchToProps(dispatch) {
    return {
        doSetEmail: (email) => dispatch(setRegisterEmail(email)),
        doSetPassword: (password) => dispatch(setRegisterPassword(password)),
        doRegisterAccount: (email, password, history) => dispatch(registerAccount(email, password, history))
    }
}
export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(RegisterForm));
