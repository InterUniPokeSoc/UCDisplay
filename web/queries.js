import { supabase } from './supabase'
import React, { useState, useEffect } from 'react';

const teamError = new Error("team information is invalid")
const matchError = new Error("match information is invalid")

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
  console.log("HELLO")

  const { data: data, error: error } = await supabase
    .from('score')
    .update({ score: value })
    .eq('team_id', teamID)
    .eq('match_id', matchID)
    .select('*')

  if (data == null || data[0] == null || data[0].score == null) { return false }

  return true
}

export { fetchTeamData, fetchMatches, setCurrentMatch, updateTeamScore };