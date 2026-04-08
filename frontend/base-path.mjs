export const BASE_PATH_WITHOUT_DOMAIN = '/kickbase-laliga';
export const SITE = 'https://senoramarillo.github.io';
// Kickbase v4 competition endpoints can be consumed without the previous worker wrapper.

export const COMPETITION_CONFIG = {
  siteName: 'kickbase-laliga',
  competitionName: 'La Liga',
  competitionRoute: 'laliga',
  defaultCompetitionId: '3'
};

export const KICKBASE_API_CONFIG = {
  BASE_URL: 'https://api.kickbase.com/v4',
  CDN_URL: 'https://kickbase.b-cdn.net/',
  DEFAULT_COMPETITION_ID: COMPETITION_CONFIG.defaultCompetitionId,
  DEFAULT_OPTS: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
};

export const LALIGA_TABLE_API_CONFIG = KICKBASE_API_CONFIG;
