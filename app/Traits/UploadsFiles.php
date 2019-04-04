<?php

namespace App\Traits;

use App\Utils\Uploader;

trait UploadsFiles
{
    /**
     * Handle the upload for the uploader, and update it's attributes.
     *
     * @param mixed
     *
     * @return bool
     */
    public function upload($file)
    {
        $upload = Uploader::upload($this->getDirectory(), $file);

        // The upload attributes should be stored.
        foreach ($upload as $attribute => $value) {
            $this->attributes[$attribute] = $value;
        }

        // Update the consumer.
        return $this->update();
    }

    /**
     * Destroy an upload.
     *
     * @return bool
     */
    public function destroyUpload()
    {
        $upload = collect($this->attributes)
            ->only($this->uploadAttributes)
            ->toArray();

        // The upload attributes should be cleared.
        foreach ($this->uploadAttributes as $key => $attribute) {
            $this->attributes[$attribute] = null;
        }

        // Remove the file(s) from the disk.
        Uploader::destroy($upload);

        // Update the consumer.
        return $this->update();
    }
}
