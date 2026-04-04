import { PlayerMarketValueHistories, playerMarketValueHistoryFromApiResponse } from '../../models/player-market-value';
import { getCompetitionPlayerMarketValueHistory } from '../kickbase-v4.service';

export class PlayerMarketValueService {
  public async getData(playerId: string): Promise<PlayerMarketValueHistories> {
    const history92 = await getCompetitionPlayerMarketValueHistory(playerId, 92);

    return {
      byTimeframe: {
        '92': playerMarketValueHistoryFromApiResponse(history92)
      }
    };
  }
}

export const playerMarketValueService = new PlayerMarketValueService();
