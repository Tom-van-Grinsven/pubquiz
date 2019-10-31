import React from "react";
import {Card, Table} from "react-bootstrap";

function Leaderboard(props) {

    return (
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
                    <tr>
                        <td>1</td>
                        <td>Team 1</td>
                        <td>12</td>
                        <td>5/5</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Team 2</td>
                        <td>9</td>
                        <td>4/5</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Team 3</td>
                        <td>8</td>
                        <td>3/5</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Team 4</td>
                        <td>5</td>
                        <td>2/5</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Team 5</td>
                        <td>5</td>
                        <td>2/5</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>Team 6</td>
                        <td>4</td>
                        <td>1/5</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>Team 7</td>
                        <td>4</td>
                        <td>1/5</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>Team 8</td>
                        <td>1</td>
                        <td>0/5</td>
                    </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    )
}

export default Leaderboard