import React, { useState, useEffect, useRef } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Loader from '../components/loader.js'
import Score from '../components/score.js'

import { supabase } from '../web/supabase'

import { fetchConfig, fetchImageToPresent, fetchMusicToPlay, fetchTeamData } from '../web/queries.js'

export default function Home() {

  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const [boardState, setBoardState] = useState(0);

  const [teamData, setTeamData] = useState(null);

  const [imageData, setImageData] = useState(null);

  const [musicData, setMusicData] = useState(null);

  // const [player, setPlayer] = useState(null);

  const [detectedChange, setDetectedChange] = useState(null);

  const [player, setPlayer] = useState(null);
  /*
    On page load make an API call to Supabase
  */
  useEffect(() => {
    if (detectedChange == null) { setIsLoading(true) }

    fetchConfig().then((config) => {
      setBoardState(config.board_state)

      fetchTeamData().then((items) => {
        setTeamData(items)
      }).catch((e) => {
        console.log(e)
        setTeamData(null)
      }).finally(() => {
        setIsLoading(false)
      })
    }).catch((e) => {
      console.log(e)
      setBoardState(0)
      setIsLoading(false)
    })

    fetchImageToPresent().then((item) => {
      setImageData(item)
    }).catch((e) => {
      console.log(e)
      setImageData(null)
    })

    fetchMusicToPlay().then((item) => {
      setMusicData(item)

      console.log("FETCHED MUSIC")

      if (item != null && item != false) {
        console.log("MUSIC SELECTED!")
        if(player.src != item.url) { player.src = item.url }

        player.volume = (item.volume / 100)

        if (item.restart_music) { 
          console.log("RESTART MUSIC!")
          item.currentTime = 0
          player.src = item.url
        }

        if (item.is_playing) {
          console.log("PLAYING MUSIC!")
          player.play()
        } else {
          console.log("PAUSING MUSIC!")
          player.pause()
        }
      } else {
        console.log("STOPPING MUSIC!")
        player.pause()
      }

      console.log(item)
    }).catch((e) => {
      console.log(e)
      setMusicData(null)
    })
  }, [detectedChange])

  useEffect(() => {
    supabase
    .channel('*')
    .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
      setDetectedChange(payload)
    })
    .subscribe()

    setPlayer(new Audio())
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
        
        { !isLoading && !isStarted &&
          <button className="btn btn-outline-secondary" type="button" onClick={ () => { setIsStarted(true) } }>Start Board</button>
        }

        { !isLoading && isStarted &&
          <>
            { boardState == 0 &&
              <>
                { imageData?.url == null &&
                  <h1 className={styles.title}>
                    { teamData != null ? "Pokémon University Challenge" : "Error"}
                  </h1>
                }

                { imageData?.url != null &&
                  <img className={styles.mainImage} src={ imageData?.url ?? "" } />
                }

                { teamData != null && teamData.team1 != null && imageData?.url == null &&
                  <Score uniName={ teamData.team1.name } score={ teamData.team1.score } />
                }

                { teamData != null && teamData.team2 != null && imageData?.url == null &&
                  <Score uniName={ teamData.team2.name } score={ teamData.team2.score } />
                }
              </>
            }

            { boardState == 1 &&
              <video className={styles.mainVideo} src="https://pitmslrfogqaymkyfwhd.supabase.co/storage/v1/object/public/main//puc_s4_opening.mp4"
               type="video/mp4" muted autoPlay no-controls loop />
            }

            { boardState == 2 &&
              <h1 className={styles.title}>
                { "Please take your seats. We're about to begin!" }
              </h1>
            }

            { boardState == 3 &&
              <video className={styles.mainVideo} src="https://pitmslrfogqaymkyfwhd.supabase.co/storage/v1/object/public/main//puc_s4_opening.mp4"
               type="video/mp4" autoPlay no-controls />
            }

            { boardState == 4 &&
              <img src="./title_card.png" className={styles.mainImage} />
            }

            { boardState == 5 &&
              <h1 className={styles.technicalTrouble}>
                { "We're Having Technical Trouble. Please Stand By." }
              </h1>
            }
          </>
        }
      </main>
    </div>
  )
}
