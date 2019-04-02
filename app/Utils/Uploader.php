<?php

namespace App\Utils;

use Image;
use Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class Uploader
{
    /**
     * Put the file into the storage.
     *
     * @param string $directory
     * @param Illuminate\Http\UploadedFile $file
     *
     * @return array
     */
    public static function upload(string $directory, UploadedFile $file)
    {
        $disk = config('filesystems.default');
        $filename = str_random(64).'.'.$file->getClientOriginalExtension();
        $original_filename = $file->getClientOriginalName();

        // Upload the file
        $path = Storage::putFileAs($directory, $file, $filename);
        $url = Storage::url($path);
        $thumbnail_url = null;

        // Do image manipulations
        if (Str::startsWith($file->getClientMimeType(), 'image')) {
            $thumbnailDirectory = "{$directory}/thumbnails";
            $thumbnailPath = "{$thumbnailDirectory}/{$filename}";

            if (! Storage::exists($thumbnailDirectory)) {
                Storage::makeDirectory($thumbnailDirectory);
            }

            $fileSystemRoot = config("filesystems.disks.{$disk}.root");
            $fullPath = "{$fileSystemRoot}/{$path}";
            $fullThumbnailPath =
                "{$fileSystemRoot}/{$thumbnailDirectory}/{$filename}";

            Image::make($fullPath)
                ->fit(240)
                ->save($fullThumbnailPath, 95);

            $thumbnail_url = Storage::url($thumbnailPath);
        }

        return compact([
            'directory', 'filename', 'original_filename', 'url', 'thumbnail_url'
        ]);
    }
}
