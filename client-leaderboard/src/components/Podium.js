import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import {fetchScore} from "../reducers/LeaderboardReducer";
import {connect} from "react-redux";

function Podium(props) {




    return (
        <div className='podium-container'>
            <div className='banner-container'>
                <h1 className="banner">Congratulations Team 1</h1>
            </div>
            <Row className='podium'>
                <Col className='podium-col' xs='4'>
                    <div className='text-center'>
                        <img width='50%' src={process.env.PUBLIC_URL + '/images/trophy/silver.png'}  />
                    </div>
                    <Card className='orange text-center'>
                        <Card.Body>
                            <h2>2</h2>
                            <h2>'t Winkeltje</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='podium-col' xs='4'>
                    <div className='text-center'>
                        <img width='60%' src={process.env.PUBLIC_URL + '/images/trophy/gold.png'}  />
                    </div>
                    <Card className='green text-center'>
                        <Card.Body>
                            <h1>1</h1>
                            <h1>Van Geld Accountants</h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='podium-col' xs='4'>
                    <div className='text-center'>
                        <img width='40%' src={process.env.PUBLIC_URL + '/images/trophy/bronze.png'}  />
                    </div>
                    <Card className='purple text-center'>
                        <Card.Body>
                            <h3>3</h3>
                            <h3>Harry's Doner Shop</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
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