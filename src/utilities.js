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

const checkForEmailErrors = (authResult) => {
// check for Unauthorized Error
    if (authResult.error == 'unauthorized') {
        let error_description = JSON.parse(authResult.error_description);
        switch (error_description.type) {
            case 'domain_blacklist':
                openDomainBlacklistError();
                break;
            case 'email_verification':
                openEmailVerificationError(error_description.resend_link);
                break;
            default:
                break;
        }
    }
}

const openDomainBlacklistError = () => {
    const warning = `Sorry, we are unable to create an account for this email address. Please register with an address from another domain.`;
    return insertErrorMsg(warning);
}

const openEmailVerificationError = (resendLink) => {
    if (validateLink(resendLink)) {
        const warning = `Your email address has not been verified yet. Please check the link that was emailed to you, or <a href="${escape(resendLink)}">click here</a> to resend the link.`;
        insertErrorMsg(warning);
    } else {
        insertErrorMsg('Your email address has not been verified yet. Please check the link that was emailed to you.');
    }
}

const insertErrorMsg = (message) => {
    let node = document.createElement('p');
    node.innerHTML = message;
    setTimeout(() => {
         return document.getElementsByClassName('auth0-lock-header')[0].insertAdjacentHTML('afterend', `<p style="text-align: center; padding: 8px 8px 0px 8px;">${message}</p>`);
    }, 1500);
}

const validateLink = (str) => {
    let regex = /https?:\/\/api.airmap\.io(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?/;
    return !!str.match(regex);
}

module.exports = {
    supportsLocalStorage,
    checkForEmailErrors
}
