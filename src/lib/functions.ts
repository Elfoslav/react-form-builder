export function generateInputName(str: string) {
  const name = removeSpecialCharacters(str);
  return name ? name.trim().toLowerCase().replace(/ /g, '-') : '';
}

export function removeSpecialCharacters(str: string) {
  // Use a regular expression to match all special characters and replace them with an empty string
  return str.replace(/[^\w\sá-žÁ-Ž]/g, '');
}