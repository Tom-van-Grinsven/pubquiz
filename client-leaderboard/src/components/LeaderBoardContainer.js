import React from "react";
import LeaderboardHeader from "./LeaderboardHeader";
import CurrentQuestionDisplay from "./CurrentQuestionDisplay";
import LeaderboardTeamAnswersList from "./LeaderboardTeamAnswersList";
import Leaderboard from "./Leaderboard";
import {Col, Row} from "react-bootstrap";


function LeaderBoardContainer(props) {

    return (
        <Row className='quiz-leaderboard'>
            <Col className='col' md='6'>
                {/*<LeaderboardHeader/>*/}
                <CurrentQuestionDisplay/>
                <LeaderboardTeamAnswersList/>
            </Col>
            <Col className='col' md='6'>
                <Leaderboard/>
            </Col>
        </Row>
    )

}

export default LeaderBoardContainer