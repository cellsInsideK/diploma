const ruRules = new Intl.PluralRules('ru');

const suffixes = new Map([
  ['one', 'я'],
  ['few', 'и'],
  ['many', 'й'],
]);

export const getPluralForCart = (num: number) => {
  const rule = ruRules.select(num);
  const suffix = suffixes.get(rule);

  return `${num} позици${suffix}`;
};
