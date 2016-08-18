const { expect } = require('../shared');
const jsdom = require('jsdom');
import AirMapAuth from '../../src/core.js';

describe('AirMap Auth Tests', () => {

    let doc = jsdom.jsdom(html);
    let window = doc.parentWindow;

    let auth = new AirMapAuth({
        client_id: 'npKaLbyw83ArwmwhxI20rOjT5lIHERdR',
        callback_url: 'http://10.110.4.142:8080/',
        logout_url: null,
        token_name: null
    });

    it('Creates instance of the AirMapAuth Constructor', () => {
        expect(auth).to.be.instanceof(AirMapAuth)
    })

    describe('Produces correct instance methods of AirMapAuth', () => {
        it('showAuth is instance methods of AirMapAuth', () => {
            expect(auth).to.have.property('showAuth')
        })
        it('isAuthenticated is instance methods of AirMapAuth', () => {
            expect(auth).to.have.property('isAuthenticated')
        })
        it('getProfile is instance methods of AirMapAuth', () => {
            expect(auth).to.have.property('getProfile')
        })
        it('logout is instance methods of AirMapAuth', () => {
            expect(auth).to.have.property('logout')
        })
    })


})
