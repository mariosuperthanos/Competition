function removeDiacritics(text: string) {
  const diacriticsMap: Record<string, string> = {
    'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
    'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T',
  };

  return text.split('').map(char => diacriticsMap[char] || char).join('');
}

export default removeDiacritics;