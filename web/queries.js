import { supabase } from './supabase'
import React, { useState, useEffect } from 'react';

const configError = new Error("config information is invalid")
const teamError = new Error("team information is invalid")
const matchError = new Error("match information is invalid")

async function fetchConfig() {
  const { data: data, error: error } = await supabase
    .from('config')
    .select(`
      id,
      board_state
    `)
    .order('id', { ascending: true })

    if (data[0] == null) { throw configError  }

    return data[0]
}

async function updateConfig(boardState) {
  const { data: data, error: error } = await supabase
    .from('config')
    .update({ board_state: boardState })
    .eq('id', 0)
    .select('*')

  if (data == null || data[0] == null || data[0].board_state == null) { return false }

  return true
}

async function fetchTeamData() {
  const { data: data, error: error } = await supabase
    .from('match')
    .select(`
      id,
      team1 ( id, name ),
      team2 ( id, name )
    `)
    .eq('present', true)
    .order('id', { ascending: true })

  const teams = data != null ? data[0] : null

  if (teams == null || teams.id == null || teams.team1 == null || teams.team2 == null) { throw teamError }

  const { data: team1ScoreData, error: team1ScoreError } = await supabase
    .from('score')
    .select(`
      score
    `)
    .eq('match_id', teams.id)
    .eq('team_id', teams.team1.id)
    .order('id', { ascending: true })

  const { data: team2ScoreData, error: team2ScoreError } = await supabase
    .from('score')
    .select(`
      score
    `)
    .eq('match_id', teams.id)
    .eq('team_id', teams.team2.id)
    .order('id', { ascending: true })

  if (team1ScoreData == null || team1ScoreData[0] == null || team1ScoreData[0].score == null
    || team2ScoreData == null || team2ScoreData[0] == null || team2ScoreData[0].score == null) { throw teamError }

  teams.team1.score = team1ScoreData[0].score
  teams.team2.score = team2ScoreData[0].score

  return teams
}

async function fetchMatches() {
  const { data: data, error: error } = await supabase
    .from('match')
    .select(`
      id,
      team1 (name),
      team2 (name)
    `)
    .order('id', { ascending: true })

    if (data == null) { throw matchError  }

    return data
}

async function setAllMatchesPresentToFalse() {
  const { data: data, error: error } = await supabase
    .from('match')
    .update({ present: false })
    .eq('present', true)
}

async function setMatch(matchID) {
  const { data: data, error: error } = await supabase
    .from('match')
    .update({ present: true })
    .eq('id', matchID)
}

async function setCurrentMatch(matchID) {
  if (matchID == null) { return }

  setAllMatchesPresentToFalse().then(() => {
    setMatch(matchID)
  }).catch((e) => {
    console.log(e)
  })
}

async function updateTeamScore(matchID, teamID, value) {
  const { data: data, error: error } = await supabase
    .from('score')
    .update({ score: value })
    .eq('team_id', teamID)
    .eq('match_id', matchID)
    .select('*')

  if (data == null || data[0] == null || data[0].score == null) { return false }

  return true
}

async function fetchImageToPresent() {
  const { data: data, error: error } = await supabase
    .from('images')
    .select('*')
    .eq('is_presenting', true)

  if (data == null || data[0] == null || data[0].url == null) { return false }

  return data[0]
}

async function fetchAllImagesInMatch(matchID) {
  console.log("FETCHING ALL IMAGES IN MATCH = "+matchID)

  const { data: data, error: error } = await supabase
    .from('images')
    .select('*')
    .eq('match_id', matchID)
    .order('placement')

  if (data == null || data[0] == null) { return false }

  return data
}

async function setSelectedAndDisplayImage(imageID) {
  if (imageID == null) { return }

  console.log("PREPARING TO SET IMAGE")

  const { data: data1, error: error1 } = await supabase
    .from('images')
    .update({ is_presenting: false })
    .neq('id', imageID)
    .select('*')

  const { data: data2, error: error2 } = await supabase
    .from('images')
    .update({ is_presenting: true })
    .eq('id', imageID)
    .select('*')

  console.log(error1)
  console.log(error2)
}

async function hideImage() {
  console.log("PREPARING TO HIDE IMAGE")

  const { data: data, error: error } = await supabase
    .from('images')
    .update({ is_presenting: false })
    .gte('id', 0) // where clause is required
    .select('*')

  console.log(error)
}

export async function fetchMusicToPlay() {
  const { data: data, error: error } = await supabase
    .from('music')
    .select('*')
    .eq('is_selected', true)

  if (data == null || data[0] == null || data[0].url == null) { return false }

  return data[0]
}

export async function fetchAllMusicInMatch(matchID) {
  console.log("FETCHING ALL MUSIC IN MATCH = "+matchID)

  const { data: data, error: error } = await supabase
    .from('music')
    .select('*')
    .eq('match_id', matchID)
    .order('placement')

  console.log("DATA:")
  console.log(data)

  if (data == null || data[0] == null) { return false }

  return data
}

export async function setSelectedAndPlayMusic(musicID) {
  if (musicID == null) { return }

  console.log("PREPARING TO SET MUSIC")

  const { data: data1, error: error1 } = await supabase
    .from('music')
    .update({ is_selected: false, is_playing: false, restart_music: true })
    .neq('id', musicID)
    .select('*')

  const { data: data2, error: error2 } = await supabase
    .from('music')
    .update({ is_selected: true, restart_music: false })
    .eq('id', musicID)
    .select('*')

  console.log(error1)
  console.log(error2)
}

export async function playMusic(musicID) {
  console.log("PREPARING TO STOP MUSIC")

  const { data: data, error: error } = await supabase
    .from('music')
    .update({ is_playing: true, restart_music: false })
    .eq('id', musicID)
    .select('*')

  console.log(error)
}

export async function pauseMusic(musicID) {
  console.log("PREPARING TO STOP MUSIC")

  const { data: data, error: error } = await supabase
    .from('music')
    .update({ is_playing: false, restart_music: false })
    .eq('id', musicID)
    .select('*')

  console.log(error)
}

export async function stopMusic() {
  console.log("PREPARING TO STOP MUSIC")

  const { data: data, error: error } = await supabase
    .from('music')
    .update({ is_playing: false, restart_music: true })
    .gte('id', 0) // where clause is required
    .select('*')

  console.log(error)
}


export { fetchConfig, updateConfig, fetchTeamData, fetchMatches, setCurrentMatch, updateTeamScore, fetchImageToPresent, fetchAllImagesInMatch, setSelectedAndDisplayImage, hideImage };