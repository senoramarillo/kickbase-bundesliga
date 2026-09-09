import { getCompetitionMatchdays, getKickbaseImageUrl } from './kickbase-v4.service';

export async function getTeamLogos(competitionId?: string): Promise<Map<string, string>> {
  const logos = new Map<string, string>();
  try {
    const matchdays = await getCompetitionMatchdays(competitionId);
    for (const day of matchdays.it ?? []) {
      for (const match of day.it ?? []) {
        if (match.t1im) logos.set(String(match.t1), getKickbaseImageUrl(match.t1im));
        if (match.t2im) logos.set(String(match.t2), getKickbaseImageUrl(match.t2im));
      }
    }
  } catch (error) {
    console.warn('Could not load team logos:', error);
  }
  return logos;
}
