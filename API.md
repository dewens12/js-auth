## airmap-auth-js
AirMap Auth0 Lock Module - JS

<a name="AirMapAuth"></a>

## AirMapAuth
Class for handling the AirMap Auth Module

**Kind**: global class  

* [AirMapAuth](#AirMapAuth)
    * [new AirMapAuth(config, options)](#new_AirMapAuth_new)
    * [.showAuth()](#AirMapAuth+showAuth) ⇒
    * [.isAuthenticated()](#AirMapAuth+isAuthenticated) ⇒ <code>boolean</code>
    * [.getUserId()](#AirMapAuth+getUserId) ⇒ <code>string</code>
    * [.getUserToken()](#AirMapAuth+getUserToken) ⇒ <code>string</code>
    * [.logout(redirect)](#AirMapAuth+logout)

<a name="new_AirMapAuth_new"></a>

### new AirMapAuth(config, options)
Create a new Auth Module.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | AirMap Auth configuration settings can be copied and pasted from the AirMap Developer Portal |
| config.auth0.client_id | <code>string</code> | Client ID provided by AirMap |
| config.auth0.callback_url | <code>string</code> | Callback URL provided by AirMap |
| options | <code>Object</code> | Optional settings for the AirMap Auth Module |
| options.closeable | <code>boolean</code> | Optional boolean will determine if the auth window can be closed when launched. Defaults to `true` |
| options.autoLaunch | <code>boolean</code> | Optional boolean. Will check on pageload if user is authenticated. If not authenticated, the auth window will launch. Defaults to `false` |

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
<a name="AirMapAuth+getUserId"></a>

### airMapAuth.getUserId() ⇒ <code>string</code>
Retreives a user's id when authenticated. If no auth token exists or if it's invalid, the return value will be null.

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
**Returns**: <code>string</code> - returns the user's id (if authenticated), null if profile could not be retrieved.  
**Access:** public  
<a name="AirMapAuth+getUserToken"></a>

### airMapAuth.getUserToken() ⇒ <code>string</code>
Retreives a user's id when authenticated. If no auth token exists or if it's invalid, the return value will be null.

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
**Returns**: <code>string</code> - returns the user's id (if authenticated), null if profile could not be retrieved.  
**Access:** public  
<a name="AirMapAuth+logout"></a>

### airMapAuth.logout(redirect)
Logs out a user by removing the authenticated user token from localStorage and redirects the user (optional).

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| redirect | <code>boolean</code> | If `true`, upon logging out, page will be redirected to the provided `logout_url`.  If no logout_url was provided in the config settings, user will be redirected to the backup callback_url.  If `false`, page will not be redirected. |
