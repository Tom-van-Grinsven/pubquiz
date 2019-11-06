import React from "react";
import {Card, Collapse, Table} from "react-bootstrap";
import {fetchScore} from "../reducers/leaderboardReducer";
import {connect} from "react-redux";
import {produce} from "immer";

function Leaderboard(props) {

    if(!props.leaderboard.isFetching && props.leaderboard.isUpdated) {
        props.doGetScore(props.quiz.code)
    }

    if(props.leaderboard.score.length === 0) {
        return null
    }

    const positions = getTeamPositionsByScore(props.leaderboard.score, true);


    const scoreTableRows = positions.map((position, index) => position.map(score => <LeaderboardRow
        key={score._id}
        position={(index + 1)}
        score={score}
        questionNr={props.leaderboard.questionNr}
    />));

    return (
        <Collapse in={true} appear={true}>
            <Card className='leaderboard'>
                <Card.Header className='green text-center'><h5><b>Leaderboard</b></h5></Card.Header>
                <Card.Body>
                    <Table striped bordered>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <th>Points</th>
                            <th>✓</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scoreTableRows}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Collapse>
    )
}

const mapStateToProps = (state) => {
    return {
        quiz: state.quiz,
        leaderboard: state.leaderboard
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        doGetScore: (quizCode) => dispatch(fetchScore(quizCode))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard)

const LeaderboardRow = (props) => {
    return (
        <tr>
            <td>{props.position}</td>
            <td>{props.score.teamName}</td>
            <td>{props.score.points}</td>
            <td>{props.score.correct}/{props.questionNr}</td>
        </tr>
    )
};

export const getTeamPositionsByScore =  (scoreArray, useCorrectQuestions = false) => {

    const sortedScoreArray  = produce(scoreArray, arr => sortScoreArray(arr, useCorrectQuestions));
    const positions         = getInitialPositionsArray(sortedScoreArray.length);
    const lastPosition      = sortedScoreArray.length - 1;

    for (let resultNr = 0; resultNr < sortedScoreArray.length; resultNr++) {
        const position = (resultNr < lastPosition ? resultNr : lastPosition);
        positions[position].push(sortedScoreArray[resultNr]);
        for (let equalResultNr = (resultNr + 1); equalResultNr < sortedScoreArray.length; equalResultNr++) {
            if (sortedScoreArray[equalResultNr].points !== sortedScoreArray[position].points || (useCorrectQuestions && sortedScoreArray[equalResultNr].correct !== sortedScoreArray[position].correct)) {
                break;
            }
            positions[position].push(sortedScoreArray[equalResultNr]);
            resultNr++;
        }
    }
    return positions;
};

const getInitialPositionsArray = (length) => {
    const positionsArray = [];
    for(let i=0; i<length; i++) {
        positionsArray.push([]);
    }
    return positionsArray
};

const sortScoreArray = (scoreArray, useCorrectQuestions) => {
    return scoreArray.sort((teamA, teamB) => {
        if(useCorrectQuestions && teamB['points'] === teamA['points']) {
            return teamB.correct - teamA.correct
        }
        return teamB.points - teamA.points
    });
};