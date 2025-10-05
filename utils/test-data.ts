import type { StatName } from '../pages/homepage';

export const EXPECTED_STATS: Record<string, Record<StatName, number>> = {
  Thief:  { Strength: 1, Agility: 6, Wisdom: 2, Magic: 1 },
  Knight: { Strength: 6, Agility: 2, Wisdom: 1, Magic: 1 },
  Mage:   { Strength: 0, Agility: 1, Wisdom: 3, Magic: 6 },
  Brigadier: { Strength: 3, Agility: 1, Wisdom: 6, Magic: 1 },
};
