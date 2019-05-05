/**
 * Get color from list.
 *
 * @param {int} key
 *
 * @return {string}
 */
export function color(key) {
    const colors = [
        'red',
        'pink',
        'purple',
        'deep-purple',
        'indigo',
        'blue',
        'light-blue',
        'cyan',
        'teal',
        'green',
        'light-green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'deep-orange',
        'brown',
        'grey',
        'blue-grey',
    ];

    return colors[key > colors.length - 1 ? 2 : key];
}
