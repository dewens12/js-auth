const escape = require('lodash.escape');

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

const getErrorMessage = (error) => {
    const err = JSON.parse(error.error_description);
    switch (err.type) {
        case 'domain_blacklist':
            return 'Sorry, we are unable to create an account for this email address. Please register with an address from another domain.';
            break;
        case 'email_verification':
            return err.resend_link ?
                `Your email address has not been verified. Please check the link that was emailed to you, or <a style="color: #fff; text-decoration: underline;" href="${escape(err.resend_link)}">click here</a> to resend the link.` :
                `Your email address has not been verified. Please check the link that was emailed to you.`;
            break;
        default:
            break;
    }
}

const validateLink = (str) => {
    let regex = /https?:\/\/api.airmap\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/;
    return !!str.match(regex);
}

module.exports = {
    getErrorMessage,
    supportsLocalStorage
}
