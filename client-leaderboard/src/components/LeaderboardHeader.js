import React from "react";
import {Card, Col, Row} from "react-bootstrap";

function LeaderboardHeader(props) {

    return (
        <Row className='quiz-round-info'>
            <Col sm='6'>
                <Card className='orange text-center'>
                    <Card.Body>
                        <h5><b>Round: 4</b></h5>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm='6'>
                <Card className='orange text-center'>
                    <Card.Body>
                        <h5><b>Question: 6</b></h5>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )

}

export default LeaderboardHeader;