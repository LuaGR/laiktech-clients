export const parseCostAmount = (raw: string): number | null => {
  const parsed = parseFloat(raw);
  return isNaN(parsed) || parsed < 0 ? null : parsed;
};
