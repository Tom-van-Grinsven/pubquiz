import React, {useEffect, useRef, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import QuestionNav from "./QuestionNav";
import TeamQuestionAnswers from "./TeamQuestionAnswers";

function QuizMasterDashboard() {

    const [navHeight, setNavHeight] = useState(0)
    const [contentHeight, setContentHeight] = useState(0)
    const navRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        setNavHeight(navRef.current.clientHeight);
        setContentHeight(contentRef.current.clientHeight)
    });

    let navStyle = {};
    if(contentHeight > 0 && contentHeight >= navHeight) {
        navStyle = {height: contentHeight + 'px'}
    }

    return (
        <Row className='quiz-master-dashboard' >
            <Col style={navStyle} ref={navRef} className='col' md='4'><QuestionNav/></Col>
            <Col ref={contentRef} className='col' md='8'><TeamQuestionAnswers/></Col>
        </Row>
    )

}

export default QuizMasterDashboard