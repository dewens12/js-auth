/**
 * AuthorizationError language/type mappings
 */
const authorizationErrorsConsts = {
    'en': {
        'domain_blacklist': `Sorry, we are unable to create an account for this email address. Please register with an address from another domain.`,
        'email_verification': `Your email address has not been verified. Please click the link that was sent to you.`,
        '__default__': `There was an error authenticating.`
    },
    'ja': {
        'domain_blacklist': `このメールアドレスを登録できませんでした。メールアドレスのドメインをご確認ください。`,
        'email_verification': `メールアドレスの確認が完了していません。すでに送信している確認メールのリンクをタップしてください。`,
        '__default__': `認証中にエラーが発生しました`
    }
}

module.exports = {
    authorizationErrorsConsts
}
