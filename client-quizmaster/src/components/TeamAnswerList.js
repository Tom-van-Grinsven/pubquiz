import React from 'react';
import {Card} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";


function TeamAnswersList(props) {

    return (
        <Card className='team-answers-list'>
            <Card.Header className='green'>
                Team Answers
            </Card.Header>
            <Card.Body>
                <div className='loading-div'>
                    <p>Waiting for answers <img width='40px' src={process.env.PUBLIC_URL + '/images/spinner.svg'} alt="spinner" /></p>
                </div>

                <div className='approve-answer-form'>
                    <p>Team 1: Geen idee</p>
                    <ButtonGroup>
                        <Button variant="outline-success">✓</Button>
                        <Button variant="outline-danger">✗</Button>
                    </ButtonGroup>
                </div>
                <div className='approve-answer-form'>
                    <p>Team 2: Geen idee</p>
                    <ButtonGroup>
                        <Button variant="outline-success">✓</Button>
                        <Button variant="outline-danger">✗</Button>
                    </ButtonGroup>
                </div>
                <div className='approve-answer-form'>
                    <p>Team 3: Geen idee</p>
                    <ButtonGroup>
                        <Button variant="outline-success">✓</Button>
                        <Button variant="outline-danger">✗</Button>
                    </ButtonGroup>
                </div>
                <div className='approve-answer-form'>
                    <p>Team 4: Geen idee</p>
                    <ButtonGroup>
                        <Button variant="outline-success">✓</Button>
                        <Button variant="outline-danger">✗</Button>
                    </ButtonGroup>
                </div>
                <div className='approve-answer-form'>
                    <p>Team 5: Geen idee</p>
                    <ButtonGroup>
                        <Button variant="outline-success">✓</Button>
                        <Button variant="outline-danger">✗</Button>
                    </ButtonGroup>
                </div>
                <div className='approve-answer-form'>
                    <p>Team 6: Geen idee</p>
                    <ButtonGroup>
                        <Button variant="outline-success">✓</Button>
                        <Button variant="outline-danger">✗</Button>
                    </ButtonGroup>
                </div>
                <div className='approve-answer-form'>
                    <p>Team 7: Geen idee</p>
                    <ButtonGroup>
                        <Button variant="outline-success">✓</Button>
                        <Button variant="outline-danger">✗</Button>
                    </ButtonGroup>
                </div>
                <div className='approve-answer-form'>
                    <p>Team 8: Geen idee</p>
                    <ButtonGroup>
                        <Button variant="outline-success">✓</Button>
                        <Button variant="outline-danger">✗</Button>
                    </ButtonGroup>
                </div>

                <Form.Group className='text-center'>
                    <Button variant="danger">Close Question</Button>
                    <Button variant="success">Validate Questions</Button>
                </Form.Group>
            </Card.Body>
        </Card>


    )
}

export default TeamAnswersList