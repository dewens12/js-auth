// Load the AirMapAuth constructor
const AirMapAuth = require('../src')

// Set up the config and options objects
// config is an object provided to the the AirMapAuth constructor
// client_id: from the AirMap Developer Portal (https://dashboard.airmap.io/developer)
// callback_url: your callback url needs to be saved on the AirMap Developer Portal (https://dashboard.airmap.io/developer)
const config = {
    // config settings from AirMap Developer Dashboard
}
// closeable: Optional boolean will determine if the auth window can be closed when launched. Defaults to `true`
// autoLaunch: Optional boolean. Will check on pageload if user is authenticated. If not authenticated, the auth window will launch. Defaults to `false`
// onAuthenticated: Optional function. Function called when Auth Module successfully authenticates the user. Parameter passed to function is the resulting Authorization object
// onAuthorizationError: Optional function. Function called when there is an error in authentication. Parameter passed to function is the resulting error object
// state: Optional string. String will be passed back with the Authorization object as 'state' on a successful authentication
// Additional options for AirMap Auth Module
const options = {
    closeable: true,
    autoLaunch: false,
    onAuthenticated: (authResult) => {console.log('onAuthenticated', authResult)},
    onAuthorizationError: (error) => {console.log('onAuthorizationError', error)},
    state: 'redirect_url'
}

// Create an instance of AirMapAuth and provide it with some configuration settings
const auth = new AirMapAuth(config, options)

// Calls the 'showAuth' method which launches the Auth Modal
window.login = () => {
    auth.showAuth()
}

// Calls the 'logout' method which destroys a user's authenticated session
window.logout = () => {
    auth.logout('http://localhost:8080/logout-redirect.html')
}

// Calls the 'isAuthenticated' method which checks if a user's session is authenticated
window.isAuthenticated = () => {
    console.log(auth.isAuthenticated())
}

// Calls the 'getUserId' method which retrieves a user's profile (if authenticated)
window.getUserId = () => {
    const userId = auth.getUserId()
    console.log(userId)
}

// Calls the 'getUserToken' method which retrieves a user's token if one exists
window.getUserToken = () => {
    const userToken = auth.getUserToken()
    console.log(userToken)
}
