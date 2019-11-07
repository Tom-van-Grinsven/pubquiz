import {Alert, Collapse} from "react-bootstrap";
import React from "react";
import Card from "react-bootstrap/Card";

export function ErrorComponent(props) {
    if(props.err !== undefined &&  props.err.messages) {
        const errorMessages = props.err.messages.map((mssg, index) => <li key={`error-mssg-${index}`}>{mssg}</li>);
        return <Collapse in={true} appear={true}>
            <Alert className={props.className} variant='danger'>
                <p>Oooooops an error occurred.....</p>
                <ul>{errorMessages}</ul>
            </Alert>
        </Collapse>
    }
    return null
}

export const LoadingComponent = (props) => {
    return (
        <Card className='purple'>
            <Card.Body>
                <div className='loading-div'>
                    <p>{props.text}</p>
                    <img width='100px' src={process.env.PUBLIC_URL + '/images/spinner-white.svg'} alt="spinner" />
                </div>
            </Card.Body>
        </Card>
    )
};

export const TeamPending = () => {
    return (
        <Card className='green'>
            <Card.Body>
                <div className='loading-div'>
                    <h3>Waiting for the Quiz Master to <br/>Accept (or Reject) the request to join the Quiz</h3>
                    <img width='150px' src={process.env.PUBLIC_URL + '/images/spinner-white.svg'} alt="spinner" />
                </div>
            </Card.Body>
        </Card>
    )
};

export const TeamRejected = () => {
    return (
        <Card className='orange'>
            <Card.Body>
                <div className='loading-div'>
                    <h1>Sorry...</h1>
                    <br/><br/>
                    <img width='250px' src={process.env.PUBLIC_URL + '/images/sad-smiley.svg'} alt="sad smiley" />
                    <br/><br/>
                    <h3>The Quiz Master has decided to <br/>Reject your application for participation in the Quiz</h3>
                </div>
            </Card.Body>
        </Card>
    )
}

export const submitOnEnter = (callback) => {
    return (event) => {
        if(event.key === 'Enter') callback();
    }
};