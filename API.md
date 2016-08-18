## airmap-auth-js
AirMap Auth0 Lock Module - JS

<a name="AirMapAuth"></a>

## AirMapAuth
Class for handling the AirMap Auth Module

**Kind**: global class  

* [AirMapAuth](#AirMapAuth)
    * [new AirMapAuth(config)](#new_AirMapAuth_new)
    * [.showAuth()](#AirMapAuth+showAuth) ⇒
    * [.isAuthenticated()](#AirMapAuth+isAuthenticated) ⇒ <code>boolean</code>
    * [.getProfile()](#AirMapAuth+getProfile) ⇒ <code>Promise</code>
    * [.logout(Redirect)](#AirMapAuth+logout)

<a name="new_AirMapAuth_new"></a>

### new AirMapAuth(config)
Create a new Auth Module.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | AirMap Auth configuration settings |
| config.client_id | <code>string</code> | Client ID provided by AirMap |
| config.callback_url | <code>string</code> | Callback URL provided by AirMap |
| config.logout_url | <code>string</code> | Optional url to be redirected to after logging out. Defaults to `callback_url` |
| config.token_name | <code>string</code> | Optional token name to be used when storing the authentication token in localStorage. Defaults to 'AirMapUserToken' |

<a name="AirMapAuth+showAuth"></a>

### airMapAuth.showAuth() ⇒
Launches the Auth Modal after checking if a valid auth token is available.

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
**Returns**: none.  
**Access:** public  
<a name="AirMapAuth+isAuthenticated"></a>

### airMapAuth.isAuthenticated() ⇒ <code>boolean</code>
Checks whether a user is authenticated, which means that they have a token stored in localStorage and that the token is not expired.

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
**Returns**: <code>boolean</code> - - If `true`, user has a valid, authenticated token. If `false`, user does not have a valid token.  
**Access:** public  
<a name="AirMapAuth+getProfile"></a>

### airMapAuth.getProfile() ⇒ <code>Promise</code>
Retreives a user's profile when authenticated. If no auth token exists, user will be shown the Auth Modal and no profile will be provided.
 If Auth0 (authentication provider) denies authentication, an error message will be shown and no profile will be provided.

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
**Returns**: <code>Promise</code> - resolves with the user's profile (if authenticated), rejected with error if profile could not be retrieved by Auth0, or authentication failure message.  
**Access:** public  
<a name="AirMapAuth+logout"></a>

### airMapAuth.logout(Redirect)
Logs out a user by removing the authenticated user token from localStorage and redirects the user (optional).

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| Redirect | <code>boolean</code> | If `true`, upon logging out, page will be redirected to the provided `logout_url`.  If no logout_url was provided in the config settings, user will be redirected to the backup callback_url.  If `false`, page will not be redirected. |
