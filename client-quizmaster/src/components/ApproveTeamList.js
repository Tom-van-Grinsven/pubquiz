import React from 'react';
import ApproveTeamForm from "./ApproveTeamForm";
import * as ReactRedux from "react-redux";
import {withRouter} from "react-router-dom";
import {fetchTeams} from "../reducers/approveTeamsReducer";


function ApproveTeamList(props) {

    if(props.isUpdated && !props.isFetching && props.quizCode !== undefined) {
        props.doFetchTeams(props.quizCode);
    }

    if(props.teams.length > 0) {
        const teamForms = props.teams.map((team) => <ApproveTeamForm key={team._id} teamName={team.teamName} approved={team.approved}/>);
        return <div>{teamForms}</div>
    } else {
        return null
    }

}

function mapStateToProps(state) {
    return {
        isUpdated: state.approveTeams.isUpdated,
        isFetching: state.approveTeams.isFetching,
        teams: state.approveTeams.teams,
        quizCode: state.quiz.code
    }
}
function mapDispatchToProps(dispatch) {
    return {
        doFetchTeams: (quizCode) => dispatch(fetchTeams(quizCode)),
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(ApproveTeamList));