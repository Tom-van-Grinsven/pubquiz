import React from 'react';
import Card from "react-bootstrap/Card";
import {Button, Form, ButtonGroup} from "react-bootstrap";
import {approveTeams} from "../reducers/approveTeamsReducer";
import * as ReactRedux from "react-redux";
import {withRouter} from "react-router-dom";
import {sendCategories, toggleCategory} from "../reducers/createRoundReducer";
import RoundCategoryList from "./RoundCategoryList";



function RoundCategorySelect(props) {

    const sendCategories = () => props.doSendCategories(props.selectedCategories, props.history);

    return (
        <Card className='purple'>
            <Card.Body>
                <div className='round-category-select-container'>
                    <h3 className='text-center'>Please select 3 categories<br/>for the next round</h3>
                    <RoundCategoryList  />
                    <Form.Group className='text-center'>
                        <Button variant="danger">End Quiz</Button>
                        <Button variant="success" onClick={sendCategories}>Start Round</Button>
                    </Form.Group>
                </div>
            </Card.Body>
        </Card>
    )
}

function mapStateToProps(state) {
    return {
        selectedCategories: state.createRound.selectedCategories
    }
}
function mapDispatchToProps(dispatch) {
    return {
        doSendCategories: (selectedCategories, history) => dispatch(sendCategories(selectedCategories, history))
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(RoundCategorySelect));

