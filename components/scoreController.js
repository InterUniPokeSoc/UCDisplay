import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.css'

// import * as styles from '../styles/loader.module.scss';

import { updateTeamScore } from '../web/queries.js'

export default function ScoreController(props) {

  const matchID = props.matchID

  const team = props.team

  const [transactionInProgress, setTransactionInProgress] = useState(false)

  const [transactionErrorOccurred, setTransactionErrorOccurred] = useState(false)

  const [scoreModifier, setScoreModifier] = useState(null)
  const [selectedScore, setSelectedScore] = useState(null)

  const CORRECT_STARTER = 10
  const CORRECT_BONUS = 5
  const INTERRUPT_QUESTION = -5

  useEffect(() => {
    if (transactionInProgress || scoreModifier == null || team.id == null || matchID == null) { return }

    setTransactionInProgress(true)
    setTransactionErrorOccurred(false)

    console.log("MATCH ID = "+matchID)
    console.log("FOR TEAM: "+team.id)
    console.log("SCORE MODIFIER = "+scoreModifier)

    updateTeamScore(matchID, team.id, scoreModifier).then((hasSuccessfullyCompleted) => {
      console.log("HAS SUCCESSFULLY COMPLETED? "+hasSuccessfullyCompleted)
    }).catch((e) => {
      console.log(e)
      setTransactionErrorOccurred(true)
    }).finally(
      setTransactionInProgress(false)
    )
  }, [scoreModifier])

  return (
    <>
      { team != null &&
        <div>
          <h1>{ team.name } <span className="badge bg-secondary">{ team.score }</span></h1>
          <div className={ `alert alert-danger fade ${ transactionErrorOccurred ? "show" : "hide"}` } role="alert">
            <strong>ERROR</strong> An error occured while attempting to modify the score!
          </div>
          <div className="btn-group" role="group" aria-label="Basic outlined example">
            <button type="button" className="btn btn-outline-success" disabled={ transactionInProgress } onClick={ e => { setScoreModifier(team.score + CORRECT_STARTER) } }>Correct Starter Answer</button>
            <button type="button" className="btn btn-outline-primary" disabled={ transactionInProgress } onClick={ e => { setScoreModifier(team.score + CORRECT_BONUS) } }>Correct Bonus Answer</button>
            <button type="button" className="btn btn-outline-danger" disabled={ transactionInProgress } onClick={ e => { setScoreModifier(team.score + INTERRUPT_QUESTION) } }>Incorrect Interruption</button>
          </div>
          <br />
          <br />
          <form>
            <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Manual Correction" aria-label="Manual Correction" aria-describedby="button-addon2" disabled={ transactionInProgress } onChange={ e => { setSelectedScore(e.target.value) } } />
            <button className="btn btn-outline-secondary" type="button" id="button-addon2" disabled={ transactionInProgress } onClick={ e => { setScoreModifier(selectedScore) } }>Set Manual Correction</button>
            </div>
          </form>
        </div>
      }
    </>
  )
}