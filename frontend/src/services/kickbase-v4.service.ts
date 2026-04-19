import * as fs from 'fs';
import * as path from 'path';
import { KICKBASE_API_CONFIG } from '../../base-path.mjs';

function loadFrontendEnvFile(): Record<string, string> {
  const envFilePath = path.resolve(process.cwd(), '.env');

  if (!fs.existsSync(envFilePath)) {
    return {};
  }

  const envContents = fs.readFileSync(envFilePath, 'utf8');
  const envEntries = envContents
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '' && !line.startsWith('#'))
    .map(line => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) {
        return undefined;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      return [key, value] as const;
    })
    .filter((entry): entry is readonly [string, string] => Boolean(entry));

  return Object.fromEntries(envEntries);
}

const frontendEnv = loadFrontendEnvFile();
const readEnv = (key: string): string | undefined => process.env[key] ?? frontendEnv[key];

const requestedCompetitionId = readEnv('KICKBASE_COMPETITION_ID') ?? KICKBASE_API_CONFIG.DEFAULT_COMPETITION_ID;
const configuredLeagueId = readEnv('KICKBASE_LEAGUE_ID');
const configuredToken = readEnv('KICKBASE_TOKEN');
const configuredEmail = readEnv('KICKBASE_EMAIL');
const configuredPassword = readEnv('KICKBASE_PASSWORD');

const competitionPlayersCache = new Map<string, Promise<any[]>>();
const competitionPlayerDetailsCache = new Map<string, Promise<any>>();
const competitionPlayerPerformanceCache = new Map<string, Promise<any>>();
const competitionPlayerMarketValueCache = new Map<string, Promise<any>>();
const competitionTableCache = new Map<string, Promise<any>>();
const competitionMatchdaysCache = new Map<string, Promise<any>>();
const matchDetailsCache = new Map<string, Promise<any>>();
const teamProfileCache = new Map<string, Promise<any>>();
const authContextPromises = new Map<string, Promise<{ token?: string; leagueId?: string; competitionId: string }>>();
const maxNetworkAttempts = 8;

function createCacheKey(...parts: string[]): string {
  return parts.join(':');
}

async function sleep(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

function getAuthCachePath(competitionId: string): string {
  return `/tmp/kickbase-bundesliga-auth-cache-${competitionId}.json`;
}

async function fetchJson<T>(path: string, competitionId: string = requestedCompetitionId): Promise<T> {
  const authContext = await getAuthContext(competitionId);
  const headers: HeadersInit = {
    ...KICKBASE_API_CONFIG.DEFAULT_OPTS.headers,
    ...(authContext.token ? { Authorization: `Bearer ${authContext.token}` } : {})
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxNetworkAttempts; attempt++) {
    try {
      const response = await fetch(`${KICKBASE_API_CONFIG.BASE_URL}${path}`, {
        ...KICKBASE_API_CONFIG.DEFAULT_OPTS,
        headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      lastError = error;
      if (attempt < maxNetworkAttempts) {
        await sleep(500 * attempt);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Failed to fetch ${path}`);
}

async function login(): Promise<any> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxNetworkAttempts; attempt++) {
    try {
      const response = await fetch(`${KICKBASE_API_CONFIG.BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          em: configuredEmail,
          pass: configuredPassword,
          loy: false,
          rep: {}
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to login: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      lastError = error;
      if (attempt < maxNetworkAttempts) {
        await sleep(500 * attempt);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Failed to login');
}

function chooseLeague(loginResponse: any, desiredCompetitionId: string): { leagueId?: string; competitionId: string } {
  const availableLeagues = Array.isArray(loginResponse?.srvl) ? loginResponse.srvl : [];
  const preferredLeague =
    availableLeagues.find((league: any) => String(league.cpi) === desiredCompetitionId) ?? availableLeagues[0];

  return {
    leagueId: configuredLeagueId ?? preferredLeague?.id,
    competitionId: String(preferredLeague?.cpi ?? desiredCompetitionId)
  };
}

function readAuthCache():
  | {
      email?: string;
      token?: string;
      leagueId?: string;
      competitionId?: string;
      tokenExpiresAt?: string;
    }
  | undefined {
  return readAuthCacheForCompetition(requestedCompetitionId);
}

function readAuthCacheForCompetition(
  competitionId: string
):
  | {
      email?: string;
      token?: string;
      leagueId?: string;
      competitionId?: string;
      tokenExpiresAt?: string;
    }
  | undefined {
  const authCachePath = getAuthCachePath(competitionId);

  if (!fs.existsSync(authCachePath)) {
    return undefined;
  }

  try {
    return JSON.parse(fs.readFileSync(authCachePath, 'utf8'));
  } catch {
    return undefined;
  }
}

function isAuthCacheValid(cacheEntry?: {
  email?: string;
  token?: string;
  leagueId?: string;
  competitionId?: string;
  tokenExpiresAt?: string;
}): boolean {
  if (!cacheEntry?.token || cacheEntry.email !== configuredEmail) {
    return false;
  }

  if (!cacheEntry.tokenExpiresAt) {
    return true;
  }

  return new Date(cacheEntry.tokenExpiresAt).getTime() > Date.now() + 60_000;
}

function canUseStaleAuthCache(cacheEntry?: {
  email?: string;
  token?: string;
  leagueId?: string;
  competitionId?: string;
  tokenExpiresAt?: string;
}): boolean {
  return Boolean(cacheEntry?.token && cacheEntry.email === configuredEmail);
}

function writeAuthCache(entry: {
  email?: string;
  token?: string;
  leagueId?: string;
  competitionId?: string;
  tokenExpiresAt?: string;
}): void {
  writeAuthCacheForCompetition(requestedCompetitionId, entry);
}

function writeAuthCacheForCompetition(
  competitionId: string,
  entry: {
    email?: string;
    token?: string;
    leagueId?: string;
    competitionId?: string;
    tokenExpiresAt?: string;
  }
): void {
  const authCachePath = getAuthCachePath(competitionId);

  try {
    fs.writeFileSync(authCachePath, JSON.stringify(entry), 'utf8');
  } catch {
    // Ignore cache write failures and continue with in-memory auth only.
  }
}

async function getAuthContext(
  competitionId: string = requestedCompetitionId
): Promise<{ token?: string; leagueId?: string; competitionId: string }> {
  if (!authContextPromises.has(competitionId)) {
    authContextPromises.set(competitionId, (async () => {
      if (configuredToken) {
        return {
          token: configuredToken,
          leagueId: configuredLeagueId,
          competitionId
        };
      }

      if (!configuredEmail || !configuredPassword) {
        return {
          token: undefined,
          leagueId: configuredLeagueId,
          competitionId
        };
      }

      const cachedAuth = readAuthCacheForCompetition(competitionId);
      if (isAuthCacheValid(cachedAuth)) {
        return {
          token: cachedAuth?.token,
          leagueId: configuredLeagueId ?? cachedAuth?.leagueId,
          competitionId: cachedAuth?.competitionId ?? competitionId
        };
      }

      try {
        const loginResponse = await login();
        const selectedLeague = chooseLeague(loginResponse, competitionId);
        const token = loginResponse.tkn ?? loginResponse.token;

        writeAuthCacheForCompetition(competitionId, {
          email: configuredEmail,
          token,
          leagueId: selectedLeague.leagueId,
          competitionId: selectedLeague.competitionId,
          tokenExpiresAt: loginResponse.tknex
        });

        return {
          token,
          leagueId: selectedLeague.leagueId,
          competitionId: selectedLeague.competitionId
        };
      } catch (error) {
        if (canUseStaleAuthCache(cachedAuth)) {
          return {
            token: cachedAuth?.token,
            leagueId: configuredLeagueId ?? cachedAuth?.leagueId,
            competitionId: cachedAuth?.competitionId ?? competitionId
          };
        }

        throw error;
      }
    })());
  }

  try {
    return await authContextPromises.get(competitionId)!;
  } catch (error) {
    authContextPromises.delete(competitionId);
    throw error;
  }
}

function canUseLeagueContext(authContext: { leagueId?: string; competitionId: string }, competitionId: string): boolean {
  return Boolean(authContext.leagueId && authContext.competitionId === competitionId);
}

export function getKickbaseImageUrl(path?: string): string {
  if (!path) {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${KICKBASE_API_CONFIG.CDN_URL}${path}`;
}

export function getKickbasePlayerPortraitUrl(playerId?: string | number, fallbackPath?: string): string {
  const normalizedPlayerId = String(playerId ?? '').trim();
  if (normalizedPlayerId !== '') {
    return `${KICKBASE_API_CONFIG.CDN_URL}pool/playersbig/${normalizedPlayerId}.png`;
  }

  return getKickbaseImageUrl(fallbackPath);
}

export async function getCompetitionTable(
  competitionId: string = requestedCompetitionId
): Promise<any> {
  const authContext = await getAuthContext(competitionId);
  const effectiveCompetitionId = competitionId ?? authContext.competitionId;
  const cacheKey = createCacheKey('table', effectiveCompetitionId);

  if (!competitionTableCache.has(cacheKey)) {
    competitionTableCache.set(
      cacheKey,
      fetchJson(`/competitions/${effectiveCompetitionId}/table`, effectiveCompetitionId).catch(error => {
        competitionTableCache.delete(cacheKey);
        if (/401|403/.test(String(error))) {
          return { it: [] };
        }

        throw error;
      })
    );
  }

  return competitionTableCache.get(cacheKey)!;
}

export async function getCompetitionMatchdays(
  competitionId: string = requestedCompetitionId
): Promise<any> {
  const authContext = await getAuthContext(competitionId);
  const effectiveCompetitionId = competitionId ?? authContext.competitionId;
  const cacheKey = createCacheKey('matchdays', effectiveCompetitionId);

  if (!competitionMatchdaysCache.has(cacheKey)) {
    competitionMatchdaysCache.set(
      cacheKey,
      fetchJson(`/competitions/${effectiveCompetitionId}/matchdays`, effectiveCompetitionId).catch(error => {
        competitionMatchdaysCache.delete(cacheKey);
        if (/401|403/.test(String(error))) {
          return { it: [] };
        }

        throw error;
      })
    );
  }

  return competitionMatchdaysCache.get(cacheKey)!;
}

export async function getCompetitionPlayers(
  competitionId: string = requestedCompetitionId
): Promise<any[]> {
  const authContext = await getAuthContext(competitionId);
  const effectiveCompetitionId = competitionId ?? authContext.competitionId;
  const cacheKey = createCacheKey('players', effectiveCompetitionId);

  if (!competitionPlayersCache.has(cacheKey)) {
    competitionPlayersCache.set(
      cacheKey,
      fetchJson<{ it?: any[] }>(`/competitions/${effectiveCompetitionId}/players?position=&sorting=`, effectiveCompetitionId)
        .then(response => response.it ?? [])
        .catch(error => {
          competitionPlayersCache.delete(cacheKey);
          if (/401|403/.test(String(error))) {
            return [];
          }

          throw error;
        })
    );
  }

  return competitionPlayersCache.get(cacheKey)!;
}

export async function getMatchDetails(matchId: string, competitionId: string = requestedCompetitionId): Promise<any> {
  const cacheKey = createCacheKey('match-details', competitionId, matchId);

  if (!matchDetailsCache.has(cacheKey)) {
    matchDetailsCache.set(
      cacheKey,
      fetchJson(`/matches/${matchId}/details`, competitionId).catch(error => {
        matchDetailsCache.delete(cacheKey);
        if (/401|403/.test(String(error))) {
          return {};
        }

        throw error;
      })
    );
  }

  return matchDetailsCache.get(cacheKey)!;
}

export async function getCompetitionPlayer(
  playerId: string,
  competitionId: string = requestedCompetitionId
): Promise<any> {
  const authContext = await getAuthContext(competitionId);
  const effectiveCompetitionId = competitionId ?? authContext.competitionId;
  const cacheKey = createCacheKey('player', effectiveCompetitionId, playerId);
  const playerPath = canUseLeagueContext(authContext, effectiveCompetitionId)
    ? `/leagues/${authContext.leagueId}/players/${playerId}`
    : `/competitions/${effectiveCompetitionId}/players/${playerId}`;

  if (!competitionPlayerDetailsCache.has(cacheKey)) {
    competitionPlayerDetailsCache.set(
      cacheKey,
      fetchJson(playerPath, effectiveCompetitionId).catch(error => {
        competitionPlayerDetailsCache.delete(cacheKey);
        if (/401|403/.test(String(error))) {
          return {};
        }

        throw error;
      })
    );
  }

  return competitionPlayerDetailsCache.get(cacheKey)!;
}

export async function getCompetitionPlayerPerformance(
  playerId: string,
  competitionId: string = requestedCompetitionId
): Promise<any> {
  const authContext = await getAuthContext(competitionId);
  const effectiveCompetitionId = competitionId ?? authContext.competitionId;
  const cacheKey = createCacheKey('performance', effectiveCompetitionId, playerId);
  const performancePath = `/competitions/${effectiveCompetitionId}/players/${playerId}/performance`;

  if (!competitionPlayerPerformanceCache.has(cacheKey)) {
    competitionPlayerPerformanceCache.set(
      cacheKey,
      fetchJson(performancePath, effectiveCompetitionId).catch(error => {
        competitionPlayerPerformanceCache.delete(cacheKey);
        if (/401|403/.test(String(error))) {
          return { it: [] };
        }

        throw error;
      })
    );
  }

  return competitionPlayerPerformanceCache.get(cacheKey)!;
}

export async function getCompetitionPlayerMarketValueHistory(
  playerId: string,
  timeframe: number = 92,
  competitionId: string = requestedCompetitionId
): Promise<any> {
  const authContext = await getAuthContext(competitionId);
  const effectiveCompetitionId = competitionId ?? authContext.competitionId;
  const marketValuePath = canUseLeagueContext(authContext, effectiveCompetitionId)
    ? `/leagues/${authContext.leagueId}/players/${playerId}/marketvalue/${timeframe}`
    : `/competitions/${effectiveCompetitionId}/players/${playerId}/marketvalue/${timeframe}`;
  const cacheKey = createCacheKey(
    'market-value',
    canUseLeagueContext(authContext, effectiveCompetitionId) ? authContext.leagueId ?? effectiveCompetitionId : effectiveCompetitionId,
    playerId,
    String(timeframe)
  );

  if (!competitionPlayerMarketValueCache.has(cacheKey)) {
    competitionPlayerMarketValueCache.set(
      cacheKey,
      fetchJson(marketValuePath, effectiveCompetitionId).catch(error => {
        competitionPlayerMarketValueCache.delete(cacheKey);
        if (/401|403/.test(String(error))) {
          return { it: [] };
        }

        throw error;
      })
    );
  }

  return competitionPlayerMarketValueCache.get(cacheKey)!;
}

export async function getTeamProfile(
  teamId: string,
  competitionId: string = requestedCompetitionId
): Promise<any> {
  const authContext = await getAuthContext(competitionId);
  const effectiveCompetitionId = competitionId ?? authContext.competitionId;
  const cacheKey = createCacheKey(
    'teamprofile',
    effectiveCompetitionId,
    canUseLeagueContext(authContext, effectiveCompetitionId) ? authContext.leagueId ?? 'no-league' : 'competition',
    teamId
  );
  const teamProfilePath = canUseLeagueContext(authContext, effectiveCompetitionId)
    ? `/leagues/${authContext.leagueId}/teams/${teamId}/teamprofile/`
    : `/competitions/${effectiveCompetitionId}/teams/${teamId}/teamprofile`;

  if (!teamProfileCache.has(cacheKey)) {
    teamProfileCache.set(
      cacheKey,
      fetchJson(teamProfilePath, effectiveCompetitionId).catch(error => {
        teamProfileCache.delete(cacheKey);
        if (/401|403/.test(String(error))) {
          return { it: [] };
        }

        throw error;
      })
    );
  }

  return teamProfileCache.get(cacheKey)!;
}
