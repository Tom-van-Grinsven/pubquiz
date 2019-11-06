import React from "react";
import {Card, Collapse} from "react-bootstrap";
import Timer from "react-compound-timer";


function TimerComponent(props) {

    if(props.activeQuestion.question === null) {
        return null;
    }

    if(props.activeQuestion.question.isClosed === true || props.activeQuestion.question.timer !== true || props.activeQuestion.question.timestamp - Math.round((new Date()).getTime()) <= 0) {
        return null;
    }

    return (
        <Collapse in={true} appear={true}>
            <Card className='timer-container'>
                <Card.Header className='green text-center'><h5><b>Answer Timer</b></h5></Card.Header>
                <Card.Body>
                    {props.activeQuestion.question.timer === true ? <QuestionTimer timestamp={props.activeQuestion.question.timestamp} /> : ''}
                </Card.Body>
            </Card>
        </Collapse>
    )

}



export default TimerComponent


const QuestionTimer = (props) => {

    const milliseconds = props.timestamp - Math.round((new Date()).getTime());

    return (
        <div>
            <Timer initialTime={milliseconds} direction="backward">
                <React.Fragment>
                    <div className='timer'>
                        <div className='cell min'><span><Timer.Minutes /></span></div>
                        <div className='cell colon'><span>:</span></div>
                        <div className='cell sec'><span><Timer.Seconds formatValue={(value) => `${(value < 10 ? `0${value}` : value)} `} /></span></div>
                    </div>
                </React.Fragment>
            </Timer>
        </div>
    )
};