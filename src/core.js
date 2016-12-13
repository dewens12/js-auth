const Auth0Lock = require('auth0-lock').default;
const jwt = require('jsonwebtoken');
const { supportsLocalStorage, checkForEmailErrors } = require('./utilities.js');
const escape = require('lodash.escape');

/** Class for handling the AirMap Auth Module */
class AirMapAuth {
     /**
      * Create a new Auth Module.
      *
      * @class
      * @param {Object} config AirMap Auth configuration settings can be copied and pasted from the AirMap Developer Portal
      * @param {string} config.auth0.client_id - Client ID provided by AirMap
      * @param {string} config.auth0.callback_url Callback URL provided by AirMap
      * @param {Object} options Optional settings for the AirMap Auth Module
      * @param {boolean} options.closeable Optional boolean will determine if the auth window can be closed when launched. Defaults to `true`
      * @param {boolean} options.autoLaunch Optional boolean. Will check on pageload if user is authenticated. If not authenticated, the auth window will launch. Defaults to `false`
      * @param {function} options.onAuthenticated Optional function. Function called when Auth Module successfully authenticates the user. Parameter passed to function is the resulting Authorization object
      * @param {function} options.onAuthorizationError Optional function. Function called when there is an error in authentication. Parameter passed to function is the resulting error object
      * @param {string} options.state Optional string. String will be passed back with the Authorization object as 'state' on a successful authentication
      * @returns {AirMapAuth}
      */
    constructor(config, options = null) {
        // Checks for Auth0 Config Variables
        if (!config || typeof config.auth0 === 'undefined') {
            throw Error('AirMap Auth - unable to instatiate an AirMap Auth Module due to missing Airmap Auth0 config variables')
        }
        if (config.auth0.client_id === 'undefined' || !config.auth0.client_id) {
            throw Error('AirMap Auth - unable to instatiate an AirMap Auth Module due to missing Airmap Auth0 client_id')
        }
        if (config.auth0.callback_url === 'undefined' || !config.auth0.callback_url) {
            throw Error('AirMap Auth - unable to instatiate an AirMap Auth Module due to missing Airmap Auth0 callback_url')
        }
        // Auth Settings - Classwide Config Variables
        this._clientId = config.auth0.client_id;
        this._callbackUrl = config.auth0.callback_url;
        this._tokenName = 'AirMapUserToken';
        this._domain = 'sso.airmap.io';
        this._userId = null;
        this._autoLaunch = options && options.hasOwnProperty('autoLaunch') ? options.autoLaunch : false;
        this._onAuthenticated = options && options.hasOwnProperty('onAuthenticated') ? options.onAuthenticated : null;
        this._onAuthorizationError = options && options.hasOwnProperty('onAuthorizationError') ? options.onAuthorizationError : null;
        this._authState = (options && options.state) ? options.state : ''
        this._authOptions = {
            auth: {
                redirectUrl: this._callbackUrl,
                redirect: true,
                responseType: 'token',
                sso: true,
                allowedConnections: ['Username-Password-Authentication', 'google'],
                params: {
                    state: this._authState
                }
            },
            closable: options && options.hasOwnProperty('closeable') ? options.closeable : true,
            theme: {
                logo: 'https://cdn.airmap.io/img/login-logo.png',
                primaryColor: '#87dadf'
            },
            rememberLastLogin: false,
            socialButtonStyle: 'big',
            languageDictionary: {
                emailInputPlaceholder: 'email@emailprovider.com',
                title: ''
            },
            avatar: null
        };

        // Creates an instance of Auth0Lock and then initiates Event Emitters
        this._lock = new Auth0Lock(this._clientId, this._domain, this._authOptions);
        this._initAuth();
    }

    _initAuth() {
        // Checks localStorage browser support
        if (!supportsLocalStorage()) {
            window.alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Please try exiting Private Browsing Mode and logging in again, or using another browser.');
        }
        // Auth0 Lock Event Emitters
        // Listens to the 'authenticated' event which is emitted when a user logs in and emmediately stores a token into localStorage.
        this._lock.on('authenticated', (authResult) => {
            localStorage.setItem(this._tokenName, authResult.idToken);
            this._userId = authResult.idTokenPayload.sub;
            if (this._onAuthenticated && typeof this._onAuthenticated === 'function') {
                this._onAuthenticated(authResult);
            }
            this._lock.hide();
        });
        // Listens to 'unrecoverable_error' which is emitted when there is an unrecoverable error, for instance when no connection is available.
        this._lock.on('unrecoverable_error', (error) => {
            console.warn(error);
        });
        // Listens to 'authorization_error' which is emitted when authorization fails. Calls logout without a redirect, launches an Auth Modal, and parses error for user.
        this._lock.on('authorization_error', (error) => {
            this.logout();
            this._lock.show();
            const parsedError = JSON.parse(error.error_description)
            if(parsedError.type !== 'email_verification') console.warn(error);
            checkForEmailErrors(error);
            if (this._onAuthorizationError && typeof this._onAuthorizationError === 'function') {
                this._onAuthorizationError(error);
            }
        });
        // Attaching event listener for DOM load when autoLaunch is desired so that an authenticated check is made.
        if (this._autoLaunch) {
            document.addEventListener("DOMContentLoaded", () => {
                this.showAuth();
            });
        }
    }

    /**
     *  Launches the Auth Modal after checking if a valid auth token is available.
     *  @public
     *  @return {void}
     */
    showAuth() {
        //Will only show Auth Modal when user does not have a valid auth token available.
        // Also, handling race conditions by checking hash for id_token as a redirect (causing DOM loading) fires before 'authenticated' event.
        let authenticated = this.isAuthenticated();
        if (authenticated || window.location.hash.indexOf('id_token') > -1) {
            this._lock.hide();
            return;
        } else {
            this._lock.show();
            return;
        }
    }

    /**
     *  Checks whether a user is authenticated, which means that they have a token stored in localStorage and that the token is not expired.
     *  @public
     *  @return {boolean} - If `true`, user has a valid, authenticated token. If `false`, user does not have a valid token.
     */
    isAuthenticated() {
        // Will only show Auth Modal when user does not have an auth token available.
        if (!localStorage.getItem(this._tokenName)) return false;
        //Checks expiration date of token.
        const decoded = jwt.decode(localStorage.getItem(this._tokenName));
        const timeStampNow = Math.floor(Date.now() / 1000);
        return timeStampNow < decoded.exp ? true : false;
    }

    /**
     *  Retreives a user's id when authenticated. If no auth token exists or if it's invalid, the return value will be null.
     *  This method can be used to retrieve the user's AirMap Id for calls to other AirMap APIs like the Pilot API, which returns a Pilot's profile.
     *  @public
     *  @return {string} returns the user's id (if authenticated), null if profile could not be retrieved.
     */
    getUserId() {
        // Looks for a valid token in localStorage.
        let authenticated = this.isAuthenticated();
        if (!authenticated) {
            return null;
        } else {
            return jwt.decode(localStorage.getItem(this._tokenName)).sub;
        }
    }

    /**
     *  Retreives a user's id when authenticated. If no auth token exists or if it's invalid, the return value will be null.
     *  @public
     *  @return {string} returns the user's token (if authenticated), null if user is not authenticated (active session).
     */
    getUserToken() {
        // Looks for a token in localStorage and makes sure the token is valid.
        return localStorage.getItem(this._tokenName) || null;
    }

    /**
     *  Logs out a user by removing the authenticated user token from localStorage and redirects the user (optional).
     *  @public
     *  @param {string} logoutUrl - If a logout url is provided as a parameter, upon logging out, page will be redirected to the provided url, otherwise no redirect.
     *  @return {void}
     */
    logout(logoutUrl = null) {
        if (!this.isAuthenticated()) return;
        if (logoutUrl) {
            localStorage.removeItem(this._tokenName);
            window.location.href = logoutUrl;
            return;
        } else {
            localStorage.removeItem(this._tokenName);
            return;
        }
    }
}

module.exports = AirMapAuth;
