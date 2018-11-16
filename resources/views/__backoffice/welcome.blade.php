<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }}</title>

        <link rel="stylesheet" href="{{ _asset('css/__backoffice/vendor.css') }}">
        <link rel="stylesheet" href="{{ _asset('css/__backoffice/app.css') }}">

        <style>
            html, body {
                height: 100%;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        </style>
    </head>

    <body>
        <div id="root"></div>

        <script src="{{ _asset('js/__backoffice/vendor.js') }}"></script>
        <script src="{{ _asset('js/__backoffice/app.js') }}"></script>
    </body>
</html>
