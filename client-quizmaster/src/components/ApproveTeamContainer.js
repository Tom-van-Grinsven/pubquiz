
import React from 'react';
import Card from "react-bootstrap/Card";
import ApproveTeamList from "./ApproveTeamList";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {withRouter} from "react-router-dom";

import * as ReactRedux from "react-redux";
import {approveTeams} from "../reducers/approveTeamsReducer";

function ApproveTeamContainer(props) {

    const approveTeams = () => props.doApproveTeams(props.teams.filter(team => team.approved === true), props.history);

    return (
            <Card className='purple'>
                <Card.Body>
                    <div className='approve-teams-containers'>
                        <h3 className='text-center'>Approve Teams</h3>
                        <div className='loading-div'>
                            <p>Waiting for teams</p>
                            <img width='100px' src={process.env.PUBLIC_URL + '/images/spinner.svg'} alt="spinner" />
                        </div>

                        <ApproveTeamList/>

                        <Form.Group className='text-center'>
                            <Button onClick={approveTeams} variant="primary">Approve Teams</Button>
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
    );
}

function mapStateToProps(state) {
    return {
        teams: state.approveTeams.teams
    }
}
function mapDispatchToProps(dispatch) {
    return {
        doApproveTeams: (approvedTeams, history) => dispatch(approveTeams(approvedTeams, history)),
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(ApproveTeamContainer));
