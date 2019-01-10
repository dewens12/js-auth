// Load the AirMapAuth constructor
const AirMapAuth = require('../src')

// Set up the config and options objects
// config is an object provided to the the AirMapAuth constructor
const config = {
    // config settings from AirMap Developer Dashboard
}
// client_id: from the AirMap Developer Portal (https://dashboard.airmap.io/developer)
// callback_url: your callback url needs to be saved on the AirMap Developer Portal (https://dashboard.airmap.io/developer)
// autoLaunch: Optional boolean. Will check on pageload if user is authenticated. If not authenticated, the auth window will launch. Defaults to `false`.
// language: Optional string. Language code for UI text. Defaults to `en`.
// Additional options for AirMap Auth Module
const options = {
    autoLaunch: false,
    language: 'en',
    domain: 'test.auth.airmap.com'
}

// Create an instance of AirMapAuth and provide it with some configuration settings
const webAuth = new AirMapAuth(config, options)

// Calls the 'showAuth' method which launches the Auth Modal
window.login = () => {
    webAuth.showAuth()
}

// Calls the 'logout' method which destroys a user's authenticated session
window.logout = () => {
    webAuth.logout('http://localhost:8080')
}

// Calls the 'isAuthenticated' method which checks if a user's session is authenticated
window.isAuthenticated = () => {
    console.log(webAuth.isAuthenticated())
}

// Calls the 'getUserId' method which retrieves a user's profile (if authenticated)
window.getUserId = () => {
    const userId = webAuth.getUserId()
    console.log(userId)
}

// Calls the 'getUserToken' method which retrieves a user's token if one exists
window.getUserToken = () => {
    const userToken = webAuth.getUserToken()
    console.log(userToken)
}
