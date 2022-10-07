import React, { useState, useEffect } from 'react';

import * as styles from '../styles/score.module.scss';

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
        <div className={ [styles.scoreWrapper].join(' ') }>
            <h2 className={ [styles.uniName].join(' ') }>{ uniName }</h2>
            <h2 className={ [styles.score].join(' ') }>{ score }</h2>
        </div>
    )
}

export default Score;