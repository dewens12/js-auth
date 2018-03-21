const auth0 = require('auth0-js')
const jwt = require('jsonwebtoken')
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
      * @param {string} options.logo Optional string. Defaults to AirMap logo.
      * @returns {AirMapAuth}
      */
    constructor(config, opts = {}) {
        // Checks for Auth0 Config Variables
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
        this._domain = this.opts.domain
        this._userId = null
        this._authParams = {
            domain: this._domain,
            clientID: this._clientId,
            redirectUri: this._callbackUrl,
            redirect: true,
            responseType: 'token'
        }

        this._webAuth = new auth0.WebAuth(this._authParams)
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

        // Process successul and failed authentication
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
        const _this = this
        this._webAuth.parseHash(function(err, authResult) {
            if (authResult && authResult.idToken) {
                _this._setSession(authResult)
            } else if (err) {
                _this._setError(err)
            }
        })
    }

    /**
     *  Begin authenticated session
     *  @private
     *  @param {object} authResult
     *  @return {void}
     */
    _setSession(authResult) {
        localStorage.setItem(this._tokenName, authResult.idToken)
        this._userId = authResult.idTokenPayload.sub
    }

    /**
     *  Process authentication error
     *  @private
     *  @param {object} error
     *  @return {void}
     */
    _setError(error) {
        this.logout()
        const err = {
            ...error,
            error_description: {
                type: '',
                ...[error.errorDescription]
            }
        }
        const authErr = new AuthorizationError(err.error_description.type)
        alert(`${authErr.getText(this.opts.language)}`)
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
        if (authenticated || window.location.hash.indexOf('id_token') > -1) {
            return
        } else {
            this._webAuth.authorize({
                language: this.opts.language,
                logo: this.opts.logo
            })
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
        const decoded = jwt.decode(localStorage.getItem(this._tokenName))
        const timeStampNow = Math.floor(Date.now() / 1000)
        return timeStampNow < decoded.exp ? true : false
    }

    /**
     *  Retreives a user's id when authenticated. If no auth token exists or if it's invalid, the return value will be null.
     *  This method can be used to retrieve the user's AirMap Id for calls to other AirMap APIs like the Pilot API, which returns a Pilot's profile.
     *  @public
     *  @return {string} returns the user's id (if authenticated), null if profile could not be retrieved.
     */
    getUserId() {
        // Looks for a valid token in localStorage.
        let authenticated = this.isAuthenticated()
        if (!authenticated) {
            return null
        } else {
            return jwt.decode(localStorage.getItem(this._tokenName)).sub
        }
    }

    /**
     *  Retreives a user's id when authenticated. If no auth token exists or if it's invalid, the return value will be null.
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
     *  @param {string} logoutUrl - If a logout url is provided as a parameter, upon logging out, page will be redirected to the provided url, otherwise no redirect.
     *  @return {void}
     */
    logout(logoutUrl = null) {
        if (!this.isAuthenticated()) return
        if (logoutUrl) {
            localStorage.removeItem(this._tokenName)
            window.location.href = logoutUrl
            return
        } else {
            localStorage.removeItem(this._tokenName)
            return
        }
    }
}

AirMapAuth.defaults = {
    autoLaunch: false,
    domain: 'sso.airmap.io',
    language: 'en',
    logo: 'https://cdn.airmap.io/img/login-logo.png'
}


module.exports = AirMapAuth
