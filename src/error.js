import { authorizationErrorsConsts } from './constants'

/**
 * Error caused when config is malformatted.
 * @private
 */
class BadConfigError extends Error {
    constructor(item) {
        super(`AirMap Auth - unable to initialize due to missing configuration item: ${item}`);
    }
}

/**
 * Handles authorization errors returned from Auth0.
 * @private
 */
class AuthorizationError {
    constructor(type) {
        this.type = authorizationErrorsConsts['en'][type] ? type : '__default__'
    }

    getText(lang = 'en') {
        return authorizationErrorsConsts[lang][this.type]
    }
}


module.exports = {
    AuthorizationError,
    BadConfigError
}
