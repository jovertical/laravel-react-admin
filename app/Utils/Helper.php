<?php

if (! function_exists('_asset')) {
    /**
     * Load the asset from our assets JSON file.
     *
     * @param string $subPath
     *
     * @return string $filePath
     */
    function _asset(string $subPath) : string {
        $assets = json_decode(file_get_contents('assets.json'), true);

        return $assets[$subPath] ?? '';
    }
}

if (! function_exists('_keyword_to_sql_operator')) {
    /**
     * Convert a keyword to an SQL operator.
     *
     * @param string $keyword
     *
     * @return string $operator
     */
    function _to_sql_operator($keyword) {
        switch ($keyword) {
            case 'eqs':
                return '=';
            break;

            case 'neqs':
                return '!=';
            break;

            case 'gt':
                return '>';
            break;

            case 'lt':
                return '<';
            break;

            case 'gte':
                return '>=';
            break;

            case 'lte':
                return '<=';
            break;

            case 'like':
                return 'LIKE';
            break;

            case 'nlike':
                return 'NOT LIKE';
            break;

            default:
                return $keyword;
            break;
        }
    }
}