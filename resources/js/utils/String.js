/**
 * Converts the first character of a string to uppercase.
 *
 * @param {string} string
 *
 * @return {string}
 */
export function _uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
