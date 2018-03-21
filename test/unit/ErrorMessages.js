import { expect, configMock, defaultOptions } from '../shared'
import { AuthorizationError } from 'src/error'
import { authorizationErrorsConsts } from 'src/constants'

describe('AuthorizationError', () => {
    describe('construction', () => {
        it('domain_blacklist', () => {
            const authError = new AuthorizationError('domain_blacklist')
            expect(authError.type).to.equal('domain_blacklist')
        })

        it('email_verification', () => {
            const authError = new AuthorizationError('email_verification')
            expect(authError.type).to.equal('email_verification')
        })

        it('default', () => {
            const authError = new AuthorizationError()
            expect(authError.type).to.equal('__default__')
        })

        it('unknown becomes default', () => {
            const authError = new AuthorizationError()
            expect(authError.type).to.equal('__default__')
        })
    })

    describe('correct english text for explicitly specified language', () => {
        it('domain_blacklist', () => {
            expect(new AuthorizationError('domain_blacklist').getText('en'))
                .to.equal(authorizationErrorsConsts.en.domain_blacklist)
        })

        it('email_verification', () => {
            expect(new AuthorizationError('email_verification').getText('en'))
                .to.equal(authorizationErrorsConsts.en.email_verification)
        })

        it('default', () => {
            expect(new AuthorizationError().getText('en'))
            .to.equal(authorizationErrorsConsts.en.__default__)
        })

        it('unknown', () => {
            expect(new AuthorizationError('this is not a correct type').getText('en'))
            .to.equal(authorizationErrorsConsts.en.__default__)
        })
    })

    describe('correct text when language is not specified', () => {
        it('domain_blacklist', () => {
            expect(new AuthorizationError('domain_blacklist').getText())
                .to.equal(authorizationErrorsConsts.en.domain_blacklist)
        })

        it('email_verification', () => {
            expect(new AuthorizationError('email_verification').getText())
                .to.equal(authorizationErrorsConsts.en.email_verification)
        })

        it('default', () => {
            expect(new AuthorizationError().getText())
            .to.equal(authorizationErrorsConsts.en.__default__)
        })

        it('unknown', () => {
            expect(new AuthorizationError('this is not a correct type').getText())
            .to.equal(authorizationErrorsConsts.en.__default__)
        })
    })

    describe('correct japanese text for explicitly specified language', () => {
        it('domain_blacklist', () => {
            expect(new AuthorizationError('domain_blacklist').getText('ja'))
                .to.equal(authorizationErrorsConsts.ja.domain_blacklist)
        })

        it('email_verification', () => {
            expect(new AuthorizationError('email_verification').getText('ja'))
                .to.equal(authorizationErrorsConsts.ja.email_verification)
        })

        it('default', () => {
            expect(new AuthorizationError().getText('ja'))
            .to.equal(authorizationErrorsConsts.ja.__default__)
        })

        it('unknown', () => {
            expect(new AuthorizationError('this is not a correct type').getText('ja'))
            .to.equal(authorizationErrorsConsts.ja.__default__)
        })
    })

})