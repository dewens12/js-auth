const oidc = require('oidc-client')
var jwtDecode = require('jwt-decode');
const { AuthorizationError, BadConfigError } = require('./error')
const { supportsLocalStorage } = require('./utilities.js')

/** Class for handling the AirMap Auth Module */
class AirMapAuth {
     /**
      * Create a new Auth Module.
      *
      * @class
      * @param {Object} config AirMap Auth configuration settings can be copied and pasted from the AirMap Developer Portal.
      * @param {string} config.auth0.client_id - Client ID provided by AirMap.
      * @param {string} config.auth0.callback_url Callback URL provided by AirMap.
      * @param {Object} options Optional settings for the AirMap Auth Module.
      * @param {boolean} options.autoLaunch Optional boolean. Will check on pageload if user is authenticated. If not authenticated, the auth window will launch. Defaults to `false`.
      * @param {string} options.domain Optional string. Defaults to `sso.airmap.io`.
      * @param {string} options.language Optional string. Language code for UI text. Defaults to `en`.
      * @param {function} options.onAuthenticated Optional function. Function called when Auth Module successfully authenticates the user. Parameter passed to function is the resulting Authorization object.
      * @returns {AirMapAuth}
      */
    constructor(config, opts = {}) {
        // Checks for oidc Config Variables
        if (!config || typeof config.auth0 === 'undefined') {
            throw new BadConfigError('auth0')
        }
        if (config.auth0.client_id === 'undefined' || !config.auth0.client_id) {
            throw new BadConfigError('auth0.client_id')
        }
        if (config.auth0.callback_url === 'undefined' || !config.auth0.callback_url) {
            throw new BadConfigError('auth0.callback_url')
        }

        // Auth Settings - Classwide Config Variables
        this.opts = { ...this.defaults, ...opts }
        this._clientId = config.auth0.client_id
        this._callbackUrl = config.auth0.callback_url
        this._tokenName = 'AirMapUserToken'
        this._authority = 'https://' + this.opts.domain + '/realms/' + this.opts.realm + '/.well-known/openid-configuration'
        this._userId = null
        this._logoutUrl = 'https://' + this.opts.domain + '/realms/' + this.opts.realm + '/protocol/openid-connect/logout'
        this._state = Math.random().toString(36).substr(2, 7)
        this._settings = {
            authority: this._authority,
            client_id: this._clientId,
            redirect_uri: this._callbackUrl,
            response_type: 'id_token token',
            scope: 'openid airmap-api profile email',
            ui_locales: this.opts.language
        }

        this._client  = new oidc.OidcClient(this._settings)
        this._initAuth()
    }

    get defaults() {
        return this.constructor.defaults
    }

    get options() {
        return this.opts
    }

    _initAuth() {
        // Checks localStorage browser support
        if (!supportsLocalStorage()) {
            window.alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Please try exiting Private Browsing Mode and logging in again, or using another browser.')
        }

        // Process successful and failed authentication
        this._handleAuthentication()

        // // Attaching event listener for DOM load when autoLaunch is desired so that an authenticated check is made.
        if (this.opts.autoLaunch) {
            document.addEventListener('DOMContentLoaded', () => {
                this.showAuth()
            })
        }
    }

    /**
     *  Process successful and failed authentication
     *  @private
     *  @return {void}
     */
    _handleAuthentication() {

       if(!this._hasIdToken()) {
          return
       }

      this._client.processSigninResponse()
      .then((response) => {
        this._setSession(response)
      }).catch((err) => {
          this._setError(err) 
      })
    }

    /**
     *  Begin authenticated session
     *  @private
     *  @param {object} authResult
     *  @return {void}
     */
    _setSession(authResult) {
        localStorage.setItem(this._tokenName, authResult.id_token)
        this._userId = authResult.profile.sub
        this.opts.onAuthenticated(authResult)
        this.sanitizeUrlRedirect()

    }

    /*
     * Returns true if the url hash contains an id_token  
    */
    _hasIdToken(){
      return (window.location.hash.indexOf('id_token') > -1)
    }

    /**
     *  Process authentication error
     *  @private
     *  @param {string} err
     *  @return {void}
     */
    _setError(err = 'An unknown error has occurred.') { 
        this.opts.onAuthenticationError(err)
    }

    /**
     *  Launches the Auth Modal after checking if a valid auth token is available.
     *  @public
     *  @return {void}
     */
    showAuth() {
        // Will only show Auth Modal when user does not have a valid auth token available.
        // Also, handling race conditions by checking hash for id_token as a redirect (causing DOM loading) fires before 'authenticated' event.
        let authenticated = this.isAuthenticated()
        if (authenticated || this._hasIdToken()) {
            return
        } else {
            this._client.createSigninRequest({ state: Math.random().toString(36).substr(2, 7) }).then(function(req) {
              console.log("signin request", req, "<a href='" + req.url + "'>go signin</a>");
              window.location = req.url;

            }).catch(function(err) {
                console.log(err);
            });
            return
        }
    }

    /**
     *  Checks whether a user is authenticated, which means that they have a token stored in localStorage and that the token is not expired.
     *  @public
     *  @return {boolean} - If `true`, user has a valid, authenticated token. If `false`, user does not have a valid token.
     */
    isAuthenticated() {
        // Will only show Auth Modal when user does not have an auth token available.
        if (!localStorage.getItem(this._tokenName)) return false
        // Checks expiration date of token.
        const decoded = jwtDecode(localStorage.getItem(this._tokenName))
        const timeStampNow = Math.floor(Date.now() / 1000)
        return timeStampNow < decoded.exp
    }

    /**
     *  Retrieves a user's id when authenticated. If no auth token exists or if it's invalid, the return value will be null.
     *  This method can be used to retrieve the user's AirMap Id for calls to other AirMap APIs like the Pilot API, which returns a Pilot's profile.
     *  @public
     *  @return {string || null} returns the user's id (if authenticated), null if profile could not be retrieved.
     */
    getUserId() {
        // Looks for a valid token in localStorage.
        let authenticated = this.isAuthenticated()
        if (!authenticated) {
            return null
        } else {
            return jwtDecode(localStorage.getItem(this._tokenName)).sub
        }
    }

    /**
     *  Retrieves a user's id when authenticated. If no auth token exists or if it's invalid, the return value will be null.
     *  @public
     *  @return {string} returns the user's token (if authenticated), null if user is not authenticated (active session).
     */
    getUserToken() {
        // Looks for a token in localStorage and makes sure the token is valid.
        return localStorage.getItem(this._tokenName) || null
    }

    /**
     *  Logs out a user by removing the authenticated user token from localStorage and redirects the user (optional).
     *  @public
     *  @param {string || null} logoutRedirectUrl - If a logoutRedirect url is provided as a parameter, upon logging out, page will be redirected to the provided url, otherwise it will redirect to the current url without the hash.
     *  @return {void}
     */
    logout(logoutRedirectUrl = null) {

        // if (!this.isAuthenticated()) return

        let logoutUrl = this._logoutUrl + '?redirect_uri=' + this.sanitizedUrl()

        if(logoutRedirectUrl){
          logoutUrl = this._logoutUrl + '?redirect_uri=' + logoutRedirectUrl
        }   

       localStorage.removeItem(this._tokenName)
        window.location.href = logoutUrl
        this.opts.onLogout()
    }

    // strips off hash and redirects to url
    sanitizeUrlRedirect(){
        window.location.href = this.sanitizedUrl()
    }

    // returns a sanitized url without hash
    sanitizedUrl() {
        return window.location.toString().split('#')[0]
    }
}

AirMapAuth.defaults = {
    domain: 'auth.airmap.com',
    autoLaunch: true,
    realm: 'airmap',
    language: 'en',
    onAuthenticated: (authResult) => null,
    onAuthenticationError: (error) => null,
    onLogout: () => null
}

module.exports = AirMapAuth
