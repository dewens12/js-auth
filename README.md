# AirMap Auth

[![Version](https://img.shields.io/npm/v/airmap-auth?style=flat)](https://www.npmjs.com/package/airmap-auth) [![License](https://img.shields.io/npm/l/airmap-auth?style=flat)](LICENSE.md)

Authenticate users with AirMap.

## Requirements

To use the AirMap Auth Module a `client_id` must be generated from the [AirMap Developers Portal](https://dashboard.airmap.io/developer). Additionally, a `callback_url` must be provided to AirMap in the Developer Portal to whitelist use of the module.

### Environment

//

### Sign up for an [AirMap Developer Account](https://dashboard.airmap.io/developer/)
[https://dashboard.airmap.io/developer](https://dashboard.airmap.io/developer)

//

## Install

From CDN

```html
<!-- Latest patch release -->
<script src="https://cdn.airmap.io/js/auth/1.0.0/index.min.js"></script>

<!-- Latest minor release -->
<script src="https://cdn.airmap.io/js/auth/v1.0/index.min.js"></script>
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

Clone the repo and run `npm install`. Open the 'index.html' file in the 'examples' folder and add your `client_id` and `callback_url` within the `config` object that is provided to the `AirMapAuth` constructor. Then, run `npm start` in the command line and navigate to the url created by Budo (temporary server service).

> Note: When testing the module with the provided examples, you'll want to start the temporary server via `npm start`, copy the url and then update the `callback_url` in the following two places:

>• 'index.html' file in the `config` object provided to the AirMapAuth constructor

>• 'Callback URL' field in the Auth0 section of the AirMap Developer Portal

As soon as the `callback_url`s match, you should be good to test out the Auth Module.

## License

> See [LICENSE](LICENSE.md) for details.
