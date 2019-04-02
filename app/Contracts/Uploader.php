<?php

namespace App\Contracts;

interface Uploader
{
    /**
     * Get the directory.
     *
     * @return string
     */
    public function getDirectory() : string;
}
