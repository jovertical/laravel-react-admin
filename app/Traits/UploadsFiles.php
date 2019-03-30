<?php

namespace App\Traits;

use Uploader;
use Illuminate\Http\UploadedFile;

trait UploadsFiles
{
    /**
     * Handle the upload for the uploader, and update it's attributes.
     *
     * @param Illuminate\Http\UploadedFile
     *
     * @return bool
     */
    public function upload(UploadedFile $file)
    {
        $upload = Uploader::upload($this->getDirectory(), $file);

        foreach ($upload as $attribute => $value) {
            $this->attributes[$attribute] = $value;
        }

        return $this->update();
    }
}
