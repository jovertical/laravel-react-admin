<?php

if (! function_exists('_asset')) {
    /**
     * Load the asset from our manifest JSON file.
     * @param string $subPath
     * @return string $filePath
     */
    function _asset(string $subPath) : string {
        $manifest = json_decode(file_get_contents('manifest.json'), true);

        return $manifest[$subPath] ?? '';
    }
}