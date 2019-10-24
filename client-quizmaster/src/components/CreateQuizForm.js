import React from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function CreateQuizForm(props) {
    return (
        <div className='create-quiz-form-container'>
            <Card>
                <Card.Body>
                    <h3 className='text-center'>Create new Quiz</h3>
                    <Form.Group>
                        <Form.Control type='text' placeholder='Quiz Name'/>
                    </Form.Group>
                    <Form.Group className='text-center'>
                        <Button variant="primary">Create Quiz</Button>
                    </Form.Group>
                </Card.Body>
            </Card>
        </div>
    )
}

export default CreateQuizForm