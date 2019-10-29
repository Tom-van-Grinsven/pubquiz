import React, {useEffect, useRef, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import QuestionNav from "./QuestionNav";
import TeamQuestionAnswers from "./TeamQuestionAnswers";
import {fetchActiveQuestion} from "../reducers/activeQuestionReducer";
import {connect} from "react-redux";

function QuizMasterDashboard(props) {

    const [navHeight, setNavHeight] = useState(0)
    const [contentHeight, setContentHeight] = useState(0)
    const navRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        setNavHeight(navRef.current !== null ? navRef.current.clientHeight : 0);
        setContentHeight(contentRef.current !== null ? contentRef.current.clientHeight: 0)
    });

    if(props.activeQuestion.isUpdated && !props.activeQuestion.isFetching) {
        props.doFetchActiveQuestion(props.quizCode);
        return null;
    }

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

const mapStateToProps = (state) => {
    return {
        quizCode: state.quiz.code,
        activeQuestion: state.dashboard.activeQuestion,
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        doFetchActiveQuestion: (quizCode) => dispatch(fetchActiveQuestion(quizCode))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizMasterDashboard)