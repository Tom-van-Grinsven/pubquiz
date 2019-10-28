import React from 'react';
import Card from "react-bootstrap/Card";
import {Button, ButtonGroup} from "react-bootstrap";
import {fetchCategories, toggleCategory} from "../reducers/createRoundReducer";
import * as ReactRedux from "react-redux";
import {withRouter} from "react-router-dom";


function RoundCategoryList(props) {

    const toggleCategory    = (event) => props.doToggleCategory(event.target.value);
    const categoryItems     = props.categories.map(category => <RoundCategoryListItem
        key={category}
        onToggle={toggleCategory}
        category={category}
        isActive={props.selectedCategories.includes(category)}
    />);

    if(props.categories.length === 0) {
        props.doFetchCategories();
        return null;
    }

    return (
        <div className='category-container'>
            <Card className='orange'>
                <Card.Header className='green text-center'>Available Categories</Card.Header>
                <Card.Body className='d-flex no-padding'>
                    <ButtonGroup vertical>
                        {categoryItems}
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        categories: state.createRound.categories,
        selectedCategories: state.createRound.selectedCategories
    }
}
function mapDispatchToProps(dispatch) {
    return {
        doFetchCategories: () => dispatch(fetchCategories()),
        doToggleCategory: (category) => dispatch(toggleCategory(category)),
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(withRouter(RoundCategoryList));

function RoundCategoryListItem(props) {
    if(props.isActive) {
        return <Button variant="outline-orange" onClick={props.onToggle} value={props.category} active block>{props.category} <span className='right-icon'>✓</span></Button>
    }
    return <Button onClick={props.onToggle} variant="outline-orange" value={props.category} block>{props.category}</Button>
}
