<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }}</title>

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

        <script src="{{ _asset('js/vendor.js') }}"></script>
        <script src="{{ _asset('js/app.js') }}"></script>
    </body>
</html>
