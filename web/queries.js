import { supabase } from './supabase'
import React, { useState, useEffect } from 'react';

const teamError = new Error("team information is invalid")

async function fetchTeamData() {
  const { data: data, error: error } = await supabase
    .from('match')
    .select(`
      team1 ( name, score ),
      team2 ( name, score )
    `)
    .eq('present', true)

    const teams = data != null ? data[0] : null

    if (teams == null || teams.team1 == null || teams.team2 == null) { throw teamError  }

    return teams
}

export { fetchTeamData };