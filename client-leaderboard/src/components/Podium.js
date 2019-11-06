import React, {useEffect} from "react";
import {Card, Col, Row, Table} from "react-bootstrap";
import {fetchScore} from "../reducers/leaderboardReducer";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {getTeamPositionsByScore} from "./Leaderboard";
import * as Fireworks from 'fireworks-canvas'

function Podium(props) {

    useEffect(() => {
        if(document.getElementById('fireworks-container')) {
            initFireworks();
        }
    });

    if(props.quiz.isActive === true) {
        return <Redirect to={`/${props.quiz.code}/leaderboard`} />
    }

    if(!props.leaderboard.isFetching && props.leaderboard.isUpdated) {
        props.doGetScore(props.quiz.code)
    }

    if(props.leaderboard.score.length === 0) {
        return null
    }

    const positions = getTeamPositionsByScore(props.leaderboard.score);
    const first     = positions[0].map(team => team.teamName).join(' / ');
    const second    = positions.length > 1 && positions[1].length > 0 ? positions[1].map(team => team.teamName).join(' / ') : ' - ';
    const third     = positions.length > 2 && positions[2].length > 0 ? positions[2].map(team => team.teamName).join(' / ') : ' - ';

    return (
        <div className='podium-container'>
            <div id='fireworks-container'>
            </div>
            <div className='banner-container'>
                <h1 className="banner">Congratulations Winner{positions[0].length > 1 ? 's' : ''}!</h1>
            </div>
            <Row className='podium'>
                <Col className='podium-col' xs='4'>
                    <div className='text-center'>
                        <img alt='silver' width='50%' src={process.env.PUBLIC_URL + '/images/trophy/silver.png'}  />
                    </div>
                    <Card className='orange text-center'>
                        <Card.Body>
                            <h2>2</h2>
                            <h2>{second}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='podium-col' xs='4'>
                    <div className='text-center'>
                        <img alt='gold' width='60%' src={process.env.PUBLIC_URL + '/images/trophy/gold.png'}  />
                    </div>
                    <Card className='green text-center'>
                        <Card.Body>
                            <h1>1</h1>
                            <h1>{first}</h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='podium-col' xs='4'>
                    <div className='text-center'>
                        <img alt='bronze' width='40%' src={process.env.PUBLIC_URL + '/images/trophy/bronze.png'}  />
                    </div>
                    <Card className='purple text-center'>
                        <Card.Body>
                            <h3>3</h3>
                            <h3>{third}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className='results-table'>
                <Table striped bordered>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {getTeamPositionTableRows(positions)}
                    </tbody>
                </Table>
            </div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        quiz: state.quiz,
        leaderboard: state.leaderboard
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        doGetScore: (quizCode) => dispatch(fetchScore(quizCode))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Podium)

const getTeamPositionTableRows = (positions) => {
    const rows = [];
    positions.forEach((position, index) => {
        position.forEach(team => {
            rows.push(<tr key={team._id}>
                <td>{(index + 1)}</td>
                <td>{team.teamName}</td>
                <td>{team.points}</td>
            </tr>)
        })
    });
    return rows;
};

const initFireworks = () => {

    const container = document.getElementById('fireworks-container');
    if(container) {
        const options = {
            maxRockets: 30,            // max # of rockets to spawn
            rocketSpawnInterval: 150, // millisends to check if new rockets should spawn
            numParticles: 100,        // number of particles to spawn when rocket explodes (+0-10)
            explosionMinHeight: 0.7,  // percentage. min height at which rockets can explode
            explosionMaxHeight: 0.8,  // percentage. max height before a particle is exploded
            explosionChance: 0.05     // chance in each tick the rocket will explode
        };

        const fireworks = new Fireworks(container, options);
        fireworks.start()
    }

}

