# About Laravel React Admin

This is a scaffolding project that comes with authentication &
users CRUD. It is a Single Page Application (SPA) built on top of [React.js](https://reactjs.org)
in the frontend & [Laravel](https://laravel.com) in the backend.

---

## Features

-   Progressive Web App (PWA)
-   Supports multiple locales
-   Stateless authentication system
-   Datatables with server-side pagination, sorting & dynamic filtering
-   Undo common actions
-   [Docker](https://www.docker.com) ready
-   [Image Intervention](http://image.intervention.io/) integration for image uploads

---

## Preview

You can check out the [live preview](https://laravel-react-admin.herokuapp.com)

---

## Quick Start

1. Clone the repo `git clone https://github.com/palonponjovertlota/laravel-react-admin.git`
2. Go to your project folder from your terminal
3. Run: `composer install` and `npm install`
4. After installation, run: `php artisan serve`
5. The project will run in this URL: (http://localhost:8000)

---

## Using Docker

If you prefer [Docker](https://www.docker.com), there is a working setup provided to get you started in no time.
Check your local setup to make sure that running this app in docker will work correctly.

### Localhost Should Be Freed

Make sure that the address `127.0.0.1:80` usually `localhost` is available on the _host machine_. It must be assured that **apache2**, **nginx** or any http webserver out there is not running on the _host machine_ to avoid address and port collision.

### Add a custom host

To make this app run on **docker** you must add a custom host address pointing to `localhost` or `127.0.0.1`.

### Add a virtual host

A `webserver.conf.example` file is included to help you in configuring a _virtual host_ according to your host setup. It is better to just rename it to `webserver.conf` to avoid the file being included in your version control system. **Nginx** will automatically pick up every changes to this configuration file because it is _bind-mounted_ into its container.

### You are good to go

You can now run the _image_ using the `docker-compose up` and optionally pass the `--build` flag if you intend to build the image. The app can be visited here `http:your_custom_host_address`.

### Installing PHP & NPM dependencies

Due to the fact that all files inside this app is _bind-mounted_ into the container, **docker** will just use the existing directories, in our concern the `vendor` and `node_modules`. Here is an example of running a composer install command: `docker container exec -it lra-php composer install --no-interaction --no-plugins --no-scripts`.

### Running Artisan Commands

You can run any artisan commands directly into the `lra-php` container. Here is an example of a migration command: `docker container exec -it lra-php php artisan migrate:fresh --seed`.
