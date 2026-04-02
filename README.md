**For educational and non-profit uses only. All trademarks, logos and brand names are the property of their respective owners.**

<div align="center">
  <a href="https://de.kickbase.com/"><img width="200" alt="Logo" src="logo/kickbase.jpg"></a>
  <br>
  <h1>Kickbase Insights</h1>
  This project is a used to gather data from <a href="https://www.kickbase.com/">Kickbase</a> API endpoint and visualize it in a web interface, acting as alternative for the pro membership.

  ---

  <!-- Placeholder for badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 
[![Github CI](https://github.com/senoramarillo/kickbase-bundesliga/actions/workflows/workflow.yml/badge.svg)](https://github.com/senoramarillo/kickbase-bundesliga/actions/workflows/workflow.yml)
</div>

# Architecture
<img src="https://i.imgur.com/duxHrWk.png" width="800px" />

# How to setup

### Frontend
- **Install dependencies:**
    - `npm install` Install the dependencies
- **Run frontend:**
    - `npm start` Start the development server
    - Frontend will be reachable under http://localhost:3000/
- **Kickbase v4 access:**
    - create `/Users/andy/WebstormProjects/kickbase-bundesliga/frontend/.env`
    - you can copy the template from `/Users/{username}/WebstormProjects/kickbase-bundesliga/frontend/.env.example`
    - simplest setup inside `.env`:
      `KICKBASE_EMAIL=your-email`
      `KICKBASE_PASSWORD=your-password`
    - optional overrides:
      `KICKBASE_COMPETITION_ID=1`
      `KICKBASE_LEAGUE_ID=deine-league-id`
      `KICKBASE_TOKEN=your-bearer-token`
    - if only email/password are set, the app logs in automatically during build/server rendering and picks the first league matching the requested competition

### Thanks to
- [@FelixSchuSi](https://github.com/FelixSchuSi) for the base of the frontend

---
