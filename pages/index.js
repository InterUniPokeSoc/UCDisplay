import React, { useState, useEffect } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Loader from '../components/loader.js'
import Score from '../components/score.js'

import { supabase } from '../web/supabase'

import { fetchTeamData } from '../web/queries.js'

export default function Home() {

  const [isLoading, setIsLoading] = useState(false);
  const [teamData, setTeamData] = useState(null);

  const [detectedChange, setDetectedChange] = useState(null);

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

        { !isLoading && 
          <>
            <h1 className={styles.title}>
              { teamData != null ? "University Challenge" : "Error"}
            </h1>

            { teamData != null && teamData.team1 != null &&
              <Score uniName={ teamData.team1.name } score={ teamData.team1.score } />
            }

            { teamData != null && teamData.team2 != null &&
              <Score uniName={ teamData.team2.name } score={ teamData.team2.score } />
            }
          </>
        }
      </main>
    </div>
  )
}
