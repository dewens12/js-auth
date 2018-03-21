const { expect, configMock, defaultOptions } = require('../shared')
const AirMapAuth = require('src/AirMapAuth')

describe('AirMapAuth#constructor', () => {

    it('Creates instance of the AirMapAuth Constructor', () => {
        const auth = new AirMapAuth(configMock)
        expect(auth).to.be.instanceof(AirMapAuth)
    })

    it('should provide the expected default options if none are specified', () => {
        const expected = Object.keys(defaultOptions)
        const actual = new AirMapAuth(configMock)
        expect(actual.defaults).to.have.keys(expected)
    })

    it('should override defaults if options are provided', () => {
        const expected = {
            ...defaultOptions,
            autoLaunch: true,
            language: 'ja'
        }
        const actual = new AirMapAuth(configMock, {
            autoLaunch: true,
            language: 'ja'
        })
        expect(actual.options).to.deep.equal(expected)
    })

    it('should throw if no client id is provided', () => {
        expect(() => {
            const auth = new AirMapAuth({ ...configMock, auth0: { "client_id": null } })
        }).to.throw()
    })

    it('should throw if no callback url is provided', () => {
        expect(() => {
            const auth = new AirMapAuth({ ...configMock, auth0: { "callback_url": null } })
        }).to.throw()
    })

    describe('Produces correct instance methods of AirMapAuth', () => {
        it('_initAuth is instance methods of AirMapAuth', () => {
            const auth = new AirMapAuth(configMock)
            expect(auth).to.have.property('_initAuth')
        })
        it('showAuth is instance methods of AirMapAuth', () => {
            const auth = new AirMapAuth(configMock)
            expect(auth).to.have.property('showAuth')
        })
        it('isAuthenticated is instance methods of AirMapAuth', () => {
            const auth = new AirMapAuth(configMock);
            expect(auth).to.have.property('isAuthenticated')
        })
        it('getProfile is instance methods of AirMapAuth', () => {
            const auth = new AirMapAuth(configMock)
            expect(auth).to.have.property('getUserId')
        })
        it('getProfile is instance methods of AirMapAuth', () => {
            const auth = new AirMapAuth(configMock)
            expect(auth).to.have.property('getUserToken')
        })
        it('logout is instance methods of AirMapAuth', () => {
            const auth = new AirMapAuth(configMock)
            expect(auth).to.have.property('logout')
        })
    })

})
