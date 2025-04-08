function removeDiacritics(text: string) {
  const diacriticsMap = {
    'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
    'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T',
    'ă': 'a', 'ș': 's', 'ț': 't'
  };

  return text.split('').map(char => diacriticsMap[char] || char).join('');
}

export default removeDiacritics;