# AirMap Auth

[![npm version](https://badge.fury.io/js/airmap-auth.svg)](https://badge.fury.io/js/airmap-auth)

Authenticate users with AirMap.

## Requirements

To use the AirMap Auth Module a `client_id` must be generated from the [AirMap Developer Portal](https://dashboard.airmap.io/developer). Additionally, a `callback_url` must be provided to AirMap in the Developer Portal to whitelist use of the module.

### Sign up for an [AirMap Developer Account](https://dashboard.airmap.io/developer/)
[https://dashboard.airmap.io/developer](https://dashboard.airmap.io/developer)


## Install

From CDN

```html
<!-- Latest patch release -->
<script src="https://cdn.airmap.io/js/auth/1.2.4/airmap-auth.min.js"></script>

<!-- Latest minor release -->
<script src="https://cdn.airmap.io/js/auth/v1.2/index.min.js"></script>
```

From [bower](http://bower.io)

```sh
bower install airmap-auth
```

```html
<script src="bower_components/airmap-auth/index.min.js"></script>
```

From [npm](https://npmjs.org)

```sh
npm install airmap-auth
```

After installing the `airmap-auth` module, you'll need bundle it up along with all of its dependencies using a tool like [webpack](https://webpack.github.io/) or [browserify](https://browserify.org). If you don't have a build process in place for managing dependencies, it is recommended that you use the module via bower or the CDN.

## Documentation

> [Generated API Documentation](API.md)

> [Official AirMap Docs](https://developers.airmap.com)

## Demo

[Clone the repo](https://github.com/airmap/js-auth) and run `npm install`. Open the 'index.html' file in the 'examples' folder and add the config object from the AirMap Developer Portal. Then, run `npm start` in the command line and navigate to http://localhost:8080/.

> Note: When testing the module with the provided examples, you'll want to update the `callback_url` with http://localhost:8080/ in the following two places:

>• 'index.html' file in the `config` object provided to the AirMapAuth constructor

>• 'Callback URL' field in the Auth0 section of the AirMap Developer Portal

As soon as the `callback_url`s match, you should be good to test out the Auth Module Demo.

## License

> See [LICENSE](LICENSE.md) for details.
