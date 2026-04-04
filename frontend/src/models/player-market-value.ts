export interface PlayerMarketValuePoint {
  timestamp: number;
  marketValue: number;
}

export interface PlayerMarketValueHistory {
  points: PlayerMarketValuePoint[];
  lowestMarketValue: number;
  highestMarketValue: number;
  isDropping: boolean;
}

export interface PlayerMarketValueHistories {
  byTimeframe: Record<string, PlayerMarketValueHistory>;
}

export function playerMarketValueHistoryFromApiResponse(response: any): PlayerMarketValueHistory {
  return {
    points: (response?.it ?? [])
      .map((entry: any) => ({
        timestamp: Number(entry?.dt ?? 0),
        marketValue: Number(entry?.mv ?? 0)
      }))
      .sort((left: PlayerMarketValuePoint, right: PlayerMarketValuePoint) => left.timestamp - right.timestamp),
    lowestMarketValue: Number(response?.lmv ?? 0),
    highestMarketValue: Number(response?.hmv ?? 0),
    isDropping: Boolean(response?.idp)
  };
}
