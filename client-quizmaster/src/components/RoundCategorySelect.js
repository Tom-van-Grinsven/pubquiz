import React from 'react';
import Card from "react-bootstrap/Card";
import {Button, Form, ButtonGroup, Collapse} from "react-bootstrap";
import * as ReactRedux from "react-redux";
import {withRouter} from "react-router-dom";
import {endQuiz, sendRoundCategories} from "../reducers/createRoundReducer";
import RoundCategoryList from "./RoundCategoryList";
import {ErrorComponent, LoadingComponent} from "./MiscComponents";



function RoundCategorySelect(props) {

    if(props.isFetching) {
        return <LoadingComponent text='Loading Categories...'/>;
    }

    const sendCategories = () => props.doSendCategories(props.selectedCategories, props.quizCode, props.history);
    const endQuiz = () => {
        if(window.confirm("Are you sure you want to end this quiz?")){
            props.doEndQuiz(false, props.quizCode, props.history);
        }
    };

    return (
        <Card className='purple'>
            <Collapse in={true} appear={true}>
            <Card.Body>
                <div className='round-category-select-container'>
                    <h3 className='text-center'>Please select 3 categories<br/>for the next round</h3>
                    <ErrorComponent err={props.err}/>
                    <RoundCategoryList  />
                    <Form.Group className='text-center'>
                        <Button variant="danger" onClick={endQuiz}>End Quiz</Button>
                        <Button variant="success" onClick={sendCategories}>Start Round
                            {props.isSending ? <span className="right-icon loading">&nbsp;</span> : '' }</Button>
                    </Form.Group>
                </div>
            </Card.Body>
            </Collapse>
        </Card>
    )
}

function mapStateToProps(state) {
    return {
        err: state.err,
        quizCode: state.quiz.code,
        isFetching: state.createRound.isFetching,
        isSending: state.createRound.isSending,
        selectedCategories: state.createRound.selectedCategories
    }
}
function mapDispatchToProps(dispatch) {
    return {
        doSendCategories: (selectedCategories, quizCode, history) => dispatch(sendRoundCategories(selectedCategories, quizCode, history)),
        doEndQuiz: (isActive, quizCode, history) => dispatch(endQuiz(isActive, quizCode, history))
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(RoundCategorySelect));

