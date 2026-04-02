export const BASE_PATH_WITHOUT_DOMAIN = '/kickbase-information';
export const SITE = 'https://senoramarillo.github.io';
// Kickbase v4 competition endpoints can be consumed without the previous worker wrapper.

export const KICKBASE_API_CONFIG = {
  BASE_URL: 'https://api.kickbase.com/v4',
  CDN_URL: 'https://kickbase.b-cdn.net/',
  DEFAULT_COMPETITION_ID: '1',
  DEFAULT_OPTS: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
};

export const BUNDESLIGATABLE_API_CONFIG = KICKBASE_API_CONFIG;
