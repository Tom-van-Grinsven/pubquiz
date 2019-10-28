import {Alert, Collapse} from "react-bootstrap";
import React from "react";
import Card from "react-bootstrap/Card";

export function ErrorComponent(props) {
    if(props.err.messages) {

        const errorMessages = props.err.messages.map((mssg, index) => <li key={`error-mssg-${index}`}>{mssg}</li>);
        return <Collapse in='true' appear='true'>
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