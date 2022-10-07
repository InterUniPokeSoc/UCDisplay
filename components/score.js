import React, { useState, useEffect } from 'react';

function Score(props) {

    const [uniName, setUniName] = useState(props.uniName);
    const [score, setScore] = useState(props.score);

    useEffect(() => {
        setUniName(props.uniName)
    }, [props.uniName])

    useEffect(() => {
        setScore(props.score)
    }, [props.score])

    if (uniName == null || score == null) { return }

    return (
        <div className={ [""].join(' ') }>
            <h2>{ uniName }</h2>
            <h2>{ score }</h2>
        </div>
    )
}

export default Score;