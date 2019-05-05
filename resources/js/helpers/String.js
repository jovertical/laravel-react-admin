/**
 * Converts the first character of a string to uppercase.
 *
 * @param {string} string
 *
 * @return {string}
 */
export function uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Trim the string based on number of characters.
 *
 * @param {string} string
 * @param {number} count
 * @param {string} delimiter
 *
 * @return {string}
 */
export function limit(string, count, delimiter = '...') {
    return string.slice(0, count) + (string.length > count ? delimiter : '');
}
