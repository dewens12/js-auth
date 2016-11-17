const { expect } = require('../shared');
const AirMapAuth = require('../../src/core.js');

describe('AirMap Auth Tests', () => {
    let config = {
        "airmap": {
            "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVkZW50aWFsX2lkIjoiY3JlZGVudGlhbHxZWjVMWjNuQ2xZZDRYUGlwejBXa09meUtXcWIiLCJhcHBsaWNhdGleyJjcmVkZW50aWFsX2lkIjoiY3JlZGVudGlhbHxZWjVMWjNuQ2xZZD.rcCRogVX-ixcdHxZWjVMWjNuQ2xZZDV8GJuoEDM"
        },
        "auth0": {
            "client_id": "NUkeCZYEIAcdv1NiIsInR5cCI6IkpXor",
            "callback_url": "http://localhost:8080/"
        },
        "mapbox": {
    	"access_token": null
        }
    };
    // Additional options for AirMap Auth Module
    let options = {
        closeable: true,
        autoLaunch: true
    };
    let auth = new AirMapAuth(config, options);

    it('Creates instance of the AirMapAuth Constructor', () => {
        expect(auth).to.be.instanceof(AirMapAuth)
    })

    describe('Produces correct instance methods of AirMapAuth', () => {
        it('_initAuth is instance methods of AirMapAuth', () => {
            expect(auth).to.have.property('_initAuth')
        })
        it('showAuth is instance methods of AirMapAuth', () => {
            expect(auth).to.have.property('showAuth')
        })
        it('isAuthenticated is instance methods of AirMapAuth', () => {
            expect(auth).to.have.property('isAuthenticated')
        })
        it('getProfile is instance methods of AirMapAuth', () => {
            expect(auth).to.have.property('getUserId')
        })
        it('getProfile is instance methods of AirMapAuth', () => {
            expect(auth).to.have.property('getUserToken')
        })
        it('logout is instance methods of AirMapAuth', () => {
            expect(auth).to.have.property('logout')
        })
    })


})
