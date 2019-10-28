import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function RegisterLoginContainer(props) {
    return (
        <Row>
            <Col md='6'>
                <LoginForm />
            </Col>
            <Col md='6'>
                <RegisterForm />
            </Col>
        </Row>
    );
}

export default RegisterLoginContainer;