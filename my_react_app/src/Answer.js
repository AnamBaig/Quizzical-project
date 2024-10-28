import React from 'react'

export default function Answer(props) {
    let backgroundColor = 'white'

    if (!props.selected && props.isChecked && props.isCorrect) {
        backgroundColor = 'blue';
    }
    // 2. Show yellow if selected but not yet checked
    else if (props.selected && !props.isChecked) {
        backgroundColor = 'yellow';
    }
    // 3. Show green if selected and correct
    else if (props.isChecked && props.selected && props.isCorrect) {
        backgroundColor = 'green';
    }
    // 4. Show red if selected and incorrect
    else if (props.isChecked && props.selected && !props.isCorrect) {
        backgroundColor = 'red';
    }
        
    return (
        <button className="answer--buttons" style={{backgroundColor}} onClick={(event)=> props.handleClick(props.answerId, props.questionId)}>{props.answer}</button>
    )
};


//className= {`title ${props.isSelected ? "answer--button--selected" : "answer--buttons"}`}
// pass in, and only keep the blue line to see if code working. 
// check app.js file code ternary too