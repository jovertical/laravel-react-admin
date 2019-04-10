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

1. Clone the repo `git clone https://github.com/palonponjovertlota/laravel-react-admin.git`.
2. Go to your project folder from your terminal.
3. Run: `composer install` and `npm install` to install application dependencies.
4. Copy the `env.example` file into a `.env` file and then configure based on your local setup.
5. Installation is done, you can now run: `php artisan serve` then `npm run watch`.
6. The project will run in this URL: (http://localhost:3000).

---

## Using Docker

If you prefer [Docker](https://www.docker.com), there is a working setup provided to get you started in no time.
Check your local setup to make sure that running this app in docker will work correctly:

### For Unix Based Operating Systems, Give It Proper Permissions

If you are a **Linux** / **Mac** user, make sure to give the application proper _file permissions_. The _php-fpm_ image uses `www-data` as its default user:

```
cd ~/your_projects_folder

sudo chown ${USER}:www-data -R laravel-react-admin
```

### Localhost Should Be Freed

Make sure that the address `127.0.0.1:80` usually `localhost` is available on the _host machine_. It must be assured that **apache2**, **nginx** or any http webserver out there is not running on the _host machine_ to avoid address and port collision.

### Add a custom host

To make this app run on **docker** you must add a custom host address pointing to `localhost` or `127.0.0.1`.

### Add a virtual host

A `nginx.conf.example` file is included inside `.docker/webserver` to help you in configuring a _virtual host_ according to your host setup. It is better to just rename it to `nginx.conf` to avoid the file being included in your version control system. **Nginx** will automatically pick up every changes to this configuration file because it is _bind-mounted_ into its container.

### You are good to go

You can now run the _image_ using the `docker-compose up` and optionally pass the `--build` flag if you intend to build the image. The app can be visited here `http:your_custom_host_address`.

### Installing PHP & NPM dependencies

In development, do note that all files inside this app is _bind-mounted_ into the container, **docker** will just use the existing directories, in our concern the `vendor` and `node_modules`. Here is an example of running a composer install command: `docker container exec -it laravel-react-admin-php-fpm composer install --no-interaction --no-plugins --no-scripts`.

### Running Artisan Commands

You can run any artisan commands directly into the `laravel-react-admin-php-fpm` container. Here is an example of a migration command: `docker container exec -it laravel-react-admin-php-fpm php artisan migrate:fresh --seed`.

### What about Browsersync?

As we are bundling frontend assets with [webpack](https://webpack.js.org/) under the hood, you must specify the custom host address where the application runs in docker so that webpack can proxy that to be able to develop using docker. You can pass a `--env.proxy` flag when running for example the `npm run watch` command: `npm run watch -- --env.proxy=http:your_custom_host_address`.

### Using PhpMyAdmin

You could use **PhpMyAdmin** to browse your MySql database as it is included in this **Docker** integration. Just add a _Virtual Host_ that points to `127.0.0.1` & the _Domain_ should be the same with your custom host address:

```
// /etc/hosts

127.0.0.1    phpmyadmin.your_custom_host_address
```

You could then visit **PhpMyAdmin** here: phpmyadmin.your_custom_host_address

---

## Credits

Without open source, this project will not come this far. Below are the list of technologies that the project uses:

[<img src="https://laravel-react-admin.herokuapp.com/credits/laravel.svg" width="120">](https://laravel.com)

The application use it as its backend framework.

[<img src="https://laravel-react-admin.herokuapp.com/credits/react.svg" width="120">](https://reactjs.org)

The application use it as its frontend framework.

[<img src="https://laravel-react-admin.herokuapp.com/credits/webpack.svg" width="120">](https://webpack.js.org)

The application uses it in bundling up different assets such as JavaScript, Sass, images, fonts and more.

[<img src="https://laravel-react-admin.herokuapp.com/credits/material-ui.svg" width="120">](https://material-ui.com)

The frontend of the application is designed using this UI kit.

[<img src="https://laravel-react-admin.herokuapp.com/credits/docker.svg" width="120">](https://www.docker.com)

Used in deploying the application in multiple environments (development and production).

[<img src="https://laravel-react-admin.herokuapp.com/credits/nginx.svg" width="120">](https://www.nginx.com)

Used as the application's http webserver both in development & production.

---

## Special Thanks

-   [@reeshkeed](https://github.com/reeshkeed) for designing the logo & design ideas.
