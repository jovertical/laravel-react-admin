<?php

namespace App\Utils;

use Image;
use Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class Uploader
{
    /**
     * @var string The storage driver.
     */
    protected $disk;

    public function __construct()
    {
        $this->disk = config('filesystems.default');
    }

    /**
     * Specify which storage driver will be used.
     *
     * @param string $name
     *
     * @return App\Utils\Uploader
     */
    public function disk(string $name = 'public')
    {
        $this->disk = $name;

        return $this;
    }

    /**
     * Put the file into the storage.
     *
     * @param string $directory
     * @param Illuminate\Http\UploadedFile $file
     *
     * @return array
     */
    public function put(string $directory, UploadedFile $file)
    {
        $filename = str_random(64).'.'.$file->getClientOriginalExtension();
        $original_filename = $file->getClientOriginalName();

        $path = Storage::disk($this->disk)->putFileAs(
            $directory,
            $file,
            $filename
        );

        if (Str::startsWith($file->getClientMimeType(), 'image')) {
            $thumbnailDirectory = "{$directory}/thumbnails";

            if (! Storage::exists($thumbnailDirectory)) {
                Storage::makeDirectory($thumbnailDirectory);
            }

            $fileSystemRoot = config("filesystems.disks.{$this->disk}.root");
            $fullPath = "{$fileSystemRoot}/{$path}";
            $thumbnailPath =
                "{$fileSystemRoot}/{$thumbnailDirectory}/{$filename}";

            Image::make($fullPath)
                ->fit(240)
                ->save($thumbnailPath, 95);
        }

        $path = Storage::url($path);

        return compact([
            'directory', 'filename', 'original_filename', 'path'
        ]);
    }
}
