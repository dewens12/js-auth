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
        this.type = type
    }

    getText() {
        switch (this.type) {
            case 'domain_blacklist':
                return `Sorry, we are unable to create an account for this email address. Please register with an address from another domain.`;
                break;
            case 'email_verification':
                return `Your email address has not been verified. Please click the link that was sent to you.`;
                break;
            default:
                return `There was an error authenticating.`;
                break;
        }
    }

}


module.exports = {
    AuthorizationError,
    BadConfigError
}
