export function titleCase(input: string): string {
  if (typeof input !== 'string' || !input) return '';
  // Remove non-word characters and underscores, split by space or underscore, then capitalize first letter of each word.
  return (
    input
      // Replace underscores and special characters with a space
      .replace(/[_\W]+/g, ' ')
      // Trim spaces at the start and end of the string
      .trim()
      // Split the string into words
      .split(' ')
      // Capitalize the first letter of each word, and lower case the rest of the letters
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      // Join the words back into a single string
      .join(' ')
  );
}
