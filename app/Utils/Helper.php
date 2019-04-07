<?php

use App\User;

if (! function_exists('_asset')) {
    /**
     * Load the asset from our assets JSON file.
     *
     * @param string $subPath
     *
     * @return string $filePath
     */
    function _asset(string $subPath) : string
    {
        $assets = json_decode(@file_get_contents('assets.json'), true);

        return $assets[$subPath] ?? '';
    }
}

if (! function_exists('_token_payload')) {
    /**
     * Get the token bearer payload.
     *
     * @param string $authToken
     *
     * @return array
     */
    function _token_payload(string $authToken) : array
    {
        return [
            'auth_token' => $authToken,
            'token_type' => 'bearer',
            'expires_in' => auth()->guard('api')->factory()->getTTL() * 60
        ];
    }
}

if (! function_exists('_test_user')) {
    /**
     * Login and get the then authenticated user.
     *
     * @return App\User
     */
    function _test_user()
    {
        auth()->guard('api')->login(User::first());

        return auth()->guard('api')->user();
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
    function _to_sql_operator($keyword) : string
    {
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
