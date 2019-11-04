import React from "react";
import {Card, Collapse, Table} from "react-bootstrap";
import {fetchScore} from "../reducers/LeaderboardReducer";
import {connect} from "react-redux";

function Leaderboard(props) {

    if(!props.leaderboard.isFetching && props.leaderboard.isUpdated) {
        props.doGetScore(props.quiz.code)
    }

    if(props.leaderboard.score.length === 0) {
        return null
    }

    const scoreTableRows = props.leaderboard.score.map((score, index) => <LeaderboardRow
        key={score._id}
        position={(index + 1)}
        score={score}
        questionNr={props.leaderboard.questionNr}
    />);

    return (
        <Collapse in={true} appear={true}>
            <Card className='leaderboard'>
                <Card.Header className='green'><h5><b>Leaderboard</b></h5></Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
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