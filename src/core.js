import Auth0Lock from 'auth0-lock';
import jwt from 'jsonwebtoken';

const supportsLocalStorage = () => {
    // Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
    // throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
    // to avoid the entire page breaking, without having to do a check at each usage of Storage.
    // see stackoverflow.com/a/27081429
    if (typeof localStorage === 'object') {
        try {
            localStorage.setItem('localStorage', 1);
            localStorage.removeItem('localStorage');
        }
        catch (e) {
            Storage.prototype._setItem = Storage.prototype.setItem;
            Storage.prototype.setItem = function() {};
            return false;
        }
        return true;
    } else {
        return false;
    }
}

/** Class for handling the AirMap Auth Module */
class AirMapAuth {
     /**
      * Create a new Auth Module.
      *
      * @class
      * @param {Object} config AirMap Auth configuration settings
      * @param {string} config.client_id - Client ID provided by AirMap
      * @param {string} config.callback_url Callback URL provided by AirMap
      * @param {string} config.logout_url Optional url to be redirected to after logging out. Defaults to `callback_url`
      * @param {string} config.token_name Optional token name to be used when storing the authentication token in localStorage. Defaults to 'AirMapUserToken'
      * @returns {AirMapAuth}
      */
    constructor(config) {
        // Auth Settings - Classwide Config Variables
        this._clientId = config.client_id;
        this._callbackUrl = config.callback_url;
        this._logoutUrl = config.logout_url || config.callback_url;
        this._tokenName = config.token_name || 'AirMapUserToken';
        this._domain = 'sso.airmap.io';
        this._options = {
            auth: {
                redirectUrl: this._callbackUrl,
                redirect: true,
                responseType: 'token',
                sso: true,
                allowedConnections: ['Username-Password-Authentication', 'google']
                },
            closable: true,
            theme: {
                logo: 'https://cdn.airmap.io/img/login-logo.png',
                primaryColor: '#87dadf'
            },
            rememberLastLogin: false,
            socialButtonStyle: 'big',
            languageDictionary: {
                emailInputPlaceholder: 'email@emailprovider.com',
                title: 'Log In | Sign Up'
            },
            avatar: null
        };

        if (!supportsLocalStorage()) {
            alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Please try exiting Private Browsing Mode and logging in again, or using another browser.');
        }

        // Creates an instance of Auth0Lock
        this._lock = new Auth0Lock(this._clientId, this._domain, this._options);

        // Auth0 Lock Event Emitters
        // Listens to 'authenticated' which is emitted when a user logs in and emmediately stores a token into localStorage.
        this._lock.on('authenticated', (authResult) => {
            localStorage.setItem(this._tokenName, authResult.idToken);
        });
        // Listens to 'unrecoverable_error' which is emitted when there is an unrecoverable error, for instance when no connection is available.
        this._lock.on('unrecoverable_error', (error) => {
            console.warn(error);
        });
        // Listens to 'authorization_error' which is emitted when authorization fails. Calls logout without a redirect and launches an Auth Modal.
        this._lock.on('authorization_error', (error) => {
            console.warn(error);
            this.logout(false);
            this.showAuth();
        });
    }

    /**
     *  Launches the Auth Modal after checking if a valid auth token is available.
     *  @public
     *  @return none.
     */
    showAuth() {
        //Will only show Auth Modal when user does not have an auth token available.
        let token = localStorage.getItem(this._tokenName) || null;
        let authenticated = this.isAuthenticated();
        if (!token && !authenticated) {
            this._lock.show();
        } else {
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
     *  Retreives a user's profile when authenticated. If no auth token exists, user will be shown the Auth Modal and no profile will be provided.
     *  If Auth0 (authentication provider) denies authentication, an error message will be shown and no profile will be provided.
     *  @public
     *  @return {Promise} resolves with the user's profile (if authenticated), rejected with error if profile could not be retrieved by Auth0, or authentication failure message.
     */
    getProfile() {
        // Looks for a token in localStorage and makres sure the token is valid.
        let token = localStorage.getItem(this._tokenName) || null;
        let authenticated = this.isAuthenticated();
        // Requesting for a user's profile is asynchronous so we return a promise that resolves to the profile data,
        // the error if there's an issue, or if the user is not authenticated, we load the Auth Modal and reject with a message.
        return new Promise((resolve, reject) => {
            if (!token && !authenticated) {
                this.showAuth();
                reject('User not logged in.');
            } else {
                // Requesting the user's profile and sends back the profile or error, if issue occured.
                return this._lock.getProfile(token, function (error, profile) {
                    if (error) {
                        let loggedError = 'Unable to retrieve profile. ' + error;
                        reject(loggedError);
                    } else {
                        resolve(profile);
                    }
                });
            }
        })
    }

    /**
     *  Logs out a user by removing the authenticated user token from localStorage and redirects the user (optional).
     *  @public
     *  @param {boolean} Redirect - If `true`, upon logging out, page will be redirected to the provided `logout_url`.
     *  If no logout_url was provided in the config settings, user will be redirected to the backup callback_url.
     *  If `false`, page will not be redirected.
     */
    logout(redirect = false) {
        let token = localStorage.getItem(this._tokenName);
        if (!token) return;
        if (redirect) {
            localStorage.removeItem(this._tokenName);
            window.location.href = this._logoutUrl;
            return;
        } else {
            localStorage.removeItem(this._tokenName);
            return;
        }
    }

}

module.exports = AirMapAuth
