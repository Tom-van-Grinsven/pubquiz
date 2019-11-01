import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import {updateTeamStatus} from "../reducers/approveTeamsReducer";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Collapse} from "react-bootstrap";

function ApproveTeamForm(props) {

    const updateTeamStatus = (status) => props.doUpdateTeamStatus(props.teamName, status);

    return (
        <Collapse in={true} appear={true}>
        <div className='approve-teams-form'>
            <p>{props.teamName}</p>
            <ButtonGroup aria-label="Approve Team">
                <Button variant="outline-success" onClick={() => updateTeamStatus(true)} active={props.approved !== undefined && props.approved}>✓</Button>
                <Button variant="outline-danger" onClick={() => updateTeamStatus(false)} active={props.approved !== undefined && !props.approved}>✗</Button>
            </ButtonGroup>
        </div>
        </Collapse>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        doUpdateTeamStatus: (teamName, status) => dispatch(updateTeamStatus(teamName, status))
    }
}

export default connect(null, mapDispatchToProps)(withRouter(ApproveTeamForm));