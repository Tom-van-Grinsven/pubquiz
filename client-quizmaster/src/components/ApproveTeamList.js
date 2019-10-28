import React from 'react';
import ApproveTeamForm from "./ApproveTeamForm";
import * as ReactRedux from "react-redux";
import {withRouter} from "react-router-dom";
import {fetchTeams} from "../reducers/approveTeamsReducer";


function ApproveTeamList(props) {

    if(props.teams.length === 0 && !props.isFetching) {
        props.doFetchTeams();
        return null;
    }

    const teamForms = props.teams.map((team) => <ApproveTeamForm key={team.name} teamName={team.name} approved={team.approved}/>);
    return <div>{teamForms}</div>
}

function mapStateToProps(state) {
    return {
        isFetching: state.approveTeams.isFetching,
        teams: state.approveTeams.teams
    }
}
function mapDispatchToProps(dispatch) {
    return {
        doFetchTeams: () => dispatch(fetchTeams()),
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(ApproveTeamList));