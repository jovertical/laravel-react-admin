<?php

namespace App\Utils;

use Image;
use Storage;
use Illuminate\Support\Str;

class Uploader
{
    /**
     * Put the file into the storage.
     *
     * @param string $directory
     * @param mixed $file
     *
     * @return array
     */
    public static function upload(string $directory, $file)
    {
        $disk = config('filesystems.default');
        $filename = str_random(64).'.'.$file->getClientOriginalExtension();
        $original_filename = $file->getClientOriginalName();
        $filesize = $file->getSize();
        $thumbnail_filesize = null;

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

            $image = Image::make($fullPath)
                ->fit(240)
                ->save($fullThumbnailPath, 95);

            $thumbnail_filesize = Storage::size($thumbnailPath);
            $thumbnail_url = Storage::url($thumbnailPath);
        }

        return compact([
            'directory',
            'filename',
            'original_filename',
            'filesize',
            'thumbnail_filesize',
            'url',
            'thumbnail_url'
        ]);
    }

    /**
     * Destroy files from disk.
     *
     * @param array $upload
     *
     * @return bool
     */
    public static function destroy(array $upload)
    {
        $path = "{$upload['directory']}/{$upload['filename']}";
        $thumbnailPath =
            "{$upload['directory']}/thumbnails/{$upload['filename']}";

        return Storage::delete([$path, $thumbnailPath]);
    }
}
