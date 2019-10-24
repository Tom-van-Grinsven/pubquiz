import React from 'react';
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";


function LoginForm(props) {
    return (
        <Container className='login-register-form'>
            <Card>
                <Card.Body>
                    <h3>Quizmaster Login</h3>
                    <Form.Group>
                        <Form.Control type='text' placeholder='example@domain.com'/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type='password' placeholder='password'/>
                    </Form.Group>
                    <Form.Group>
                        <Button variant="primary">Login</Button>
                    </Form.Group>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default LoginForm;