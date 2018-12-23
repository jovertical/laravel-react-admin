<?php

if (! function_exists('_asset')) {
    /**
     * Load the asset from our assets JSON file.
     * @param string $subPath
     * @return string $filePath
     */
    function _asset(string $subPath) : string {
        $assets = json_decode(file_get_contents('assets.json'), true);

        return $assets[$subPath] ?? '';
    }
}