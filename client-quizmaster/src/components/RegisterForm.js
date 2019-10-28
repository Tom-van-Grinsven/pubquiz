import React from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import * as ReactRedux from "react-redux";
import {withRouter} from "react-router-dom";
import {setRegisterEmail, setRegisterPassword} from "../reducers/registerReducer";


function RegisterForm(props) {

    const setEmail      = (event) => props.doSetEmail(event.target.value);
    const setPassword   = (event) => props.doSetPassword(event.target.value);
    const doRegister       = () => props.history.push('/quiz');

    return (
        <Container className='login-register-form'>
            <Card className='purple'>
                <Card.Body>
                    <h3>Quizmaster Register</h3>
                    <Form.Group>
                        <Form.Control type='text' onChange={setEmail} placeholder='example@domain.com'/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type='password' onChange={setPassword} placeholder='password'/>
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
        doSetPassword: (password) => dispatch(setRegisterPassword(password))
    }
}
export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(RegisterForm));
