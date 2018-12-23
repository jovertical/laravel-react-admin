<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <!-- Metas -->
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
        <meta name="description" content="{{ config('app.description') }}">
        <meta name="theme-color" content="#2196f3">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <meta property="og:site_name" content="{{ config('app.name') }}">
        <meta property="og:title" content="{{ config('app.name') }}">
        <meta property="og:description" content="{{ config('app.description') }}">
        <meta property="og:url" content="{{ config('app.url') }}">
        <meta property="og:image" content="">

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
