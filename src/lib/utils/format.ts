/**
 * Format a date to a string
 * @param date - The date to format
 * @returns The formatted date
 */
export const fDate = (date?: string | Date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Count the number of items in an array or a number
 * @param input - The array or number to count
 * @param word - The word to pluralize
 * @param nullText - The text to return if the count is 0
 * @returns The pluralized word
 */
export function cnt(
  input: Array<unknown> | number,
  word: string,
  nullText = "---"
): string {
  const count = Array.isArray(input) ? input.length : input;
  return count > 0 ? (count === 1 ? word : `${word}s`) : nullText;
}

/**
 * Format a date to a relative time
 * @param dateString - The date to format
 * @returns The formatted date
 */
export const rTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} ${cnt(diffInDays, "day")} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} ${cnt(diffInWeeks, "week")} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${cnt(diffInMonths, "month")} ago`;
  } else {
    return `${diffInYears} ${cnt(diffInYears, "year")} ago`;
  }
};
