import React from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";


function RegisterForm(props) {
    return (
        <Container className='login-register-form'>
            <Card>
                <Card.Body>
                    <h3>Quizmaster Register</h3>
                    <Form.Group>
                        <Form.Control type='text' placeholder='example@domain.com'/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type='password' placeholder='password'/>
                    </Form.Group>
                    <Form.Group>
                        <Button variant="primary">Register</Button>
                    </Form.Group>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default RegisterForm;