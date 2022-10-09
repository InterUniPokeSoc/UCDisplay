import { supabase } from './supabase'
import React, { useState, useEffect } from 'react';

const teamError = new Error("team information is invalid")
const matchError = new Error("match information is invalid")

async function fetchTeamData() {
  const { data: data, error: error } = await supabase
    .from('match')
    .select(`
      team1 ( id, name, score ),
      team2 ( id, name, score )
    `)
    .eq('present', true)
    .order('id', { ascending: true })

    const teams = data != null ? data[0] : null

    if (teams == null || teams.team1 == null || teams.team2 == null) { throw teamError  }

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

async function updateTeamScore(teamID, value) {
  const { data: data, error: error } = await supabase
    .from('team')
    .update({ score: value })
    .eq('id', teamID)
    .select('*')

  if (data == null || data[0] == null || data[0].score == null || data.score != value) { return false }

  return true
}

export { fetchTeamData, fetchMatches, setCurrentMatch, updateTeamScore };