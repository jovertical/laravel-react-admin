<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <!-- Metas -->
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />

        <!-- Title -->
        <title>{{ config('app.name') }}</title>

        <!-- Icon -->
        <link rel="shortcut icon" href="/favicon.ico">

        <!-- Stylesheets -->
        <link rel="stylesheet" href="{{ _asset('css/__backoffice/vendor.css') }}">
        <link rel="stylesheet" href="{{ _asset('css/__backoffice/app.css') }}">
    </head>

    <body>
        <noscript>
            You need JavaScript enabled to run this app.
        </noscript>

        <!-- Root Node -->
        <div id="root"></div>

        <!-- Scripts -->
        <script src="{{ _asset('js/__backoffice/vendor.js') }}"></script>
        <script src="{{ _asset('js/__backoffice/app.js') }}"></script>
    </body>
</html>
