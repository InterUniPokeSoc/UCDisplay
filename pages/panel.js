import React, { useState, useEffect } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Loader from '../components/loader.js'
import ScoreController from '../components/scoreController.js'

import 'bootstrap/dist/css/bootstrap.css'

import { supabase } from '../web/supabase'

import { fetchTeamData, fetchMatches, setCurrentMatch } from '../web/queries.js'

export default function Panel() {

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState(false);
  const [teamData, setTeamData] = useState(null);

  const [matchData, setMatchData] = useState(null);

  const [detectedChange, setDetectedChange] = useState(null);

  const [selectedMatch, setSelectedMatch] = useState(0);

  const PASSWORD = "quagsireandpipluparebesties"

    /*
      On page load make an API call to Supabase
    */
    useEffect(() => {

      if (detectedChange == null) { setIsLoading(true) }
  
      fetchTeamData().then((items) => {
        setTeamData(items)
      }).catch((e) => {
        console.log(e)
        setTeamData(null)
      }).finally(() => {
        setIsLoading(false)
      })
    }, [detectedChange])
  
    useEffect(() => {
      supabase
      .channel('*')
      .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
        setDetectedChange(payload)
      })
      .subscribe()
    }, [])

    useEffect(() => {
      fetchMatches().then((items) => {
        setMatchData(items)
      }).catch((e) => {
        console.log(e)
        setMatchData(null)
      }).finally(() => {
        setIsLoading(false)
      })
    }, [detectedChange])

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokémon University Challenge</title>
        <meta name="description" content="Pokémon University Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        { isLoading &&
          <Loader />
        }

        {/* VERY SECURE INTERFACE YAY */}
        { !isLoading && !isAuthenticated &&
          <form>
            <div className="input-group mb-3">
              <input type="password" className="form-control" placeholder="Ultra Secure Password" aria-label="Ultra Secure Password" aria-describedby="button-password" onChange={ e => { setPassword(e.target.value) } } />
              <button className="btn btn-outline-secondary" type="button" id="button-password" onClick={ e => { if(password == PASSWORD) { setIsAuthenticated(true) } } }>Login Very Securely</button>
            </div>
          </form>
        }

        { !isLoading && isAuthenticated &&
          <>
            <h1 className={styles.title}>
              { teamData != null ? "University Challenge" : "Error"}
            </h1>

            <br />

            <form>
              { matchData != null &&
                <div className="input-group">
                  <select onChange={ (e) => setSelectedMatch(e.target.value) }  className="form-select" id="inputGroupSelect04" aria-label="Example select with button addon">
                    <option value={ null } defaultValue>Select Match</option>
                    { matchData.map((match, index) => {
                        return <option key={ match.id } value={ match.id }>{ `${ match.id } (${ match.team1.name } vs ${ match.team2.name })`  }</option>
                      })
                    }
                  </select>
                  <button className="btn btn-outline-secondary" type="button" onClick={ e => setCurrentMatch(selectedMatch) }>Set Match</button>
                </div>
              }
            </form>

            <br />

            { teamData != null && teamData.team1 != null &&
              <ScoreController matchID={ teamData.id } team={ teamData.team1 } />
            }

            <br />

            { teamData != null && teamData.team2 != null &&
              <ScoreController matchID={ teamData.id } team={ teamData.team2 } />
            }
          </>
        }
      </main>
    </div>
  )
}
