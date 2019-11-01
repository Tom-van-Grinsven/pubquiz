import React from 'react';
import {Card, Container} from "react-bootstrap";

function QuizEnded() {
    return (
        <Container>
            <div className='thumb'>
                <img width='200px' src={process.env.PUBLIC_URL + '/images/thumb.svg'}   alt="Oops"/>
            </div>

            <Card className='orange'>
                <Card.Body>
                    <h3 className='text-center'>Thanks for playing!</h3>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default QuizEnded;


