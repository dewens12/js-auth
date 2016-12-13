## Modules

<dl>
<dt><a href="#module_airmap-auth">airmap-auth</a></dt>
<dd><p>AirMap Auth0 Lock Module - JS</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#AirMapAuth">AirMapAuth</a></dt>
<dd><p>Class for handling the AirMap Auth Module</p>
</dd>
</dl>

<a name="module_airmap-auth"></a>

## airmap-auth
AirMap Auth0 Lock Module - JS

<a name="AirMapAuth"></a>

## AirMapAuth
Class for handling the AirMap Auth Module

**Kind**: global class  

* [AirMapAuth](#AirMapAuth)
    * [new AirMapAuth(config, options)](#new_AirMapAuth_new)
    * [.showAuth()](#AirMapAuth+showAuth) ⇒ <code>void</code>
    * [.isAuthenticated()](#AirMapAuth+isAuthenticated) ⇒ <code>boolean</code>
    * [.getUserId()](#AirMapAuth+getUserId) ⇒ <code>string</code>
    * [.getUserToken()](#AirMapAuth+getUserToken) ⇒ <code>string</code>
    * [.logout(logoutUrl)](#AirMapAuth+logout) ⇒ <code>void</code>

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
| options.onAuthenticated | <code>function</code> | Optional function. Function called when Auth Module successfully authenticates the user. Parameter passed to function is the resulting Authorization object |
| options.onAuthorizationError | <code>function</code> | Optional function. Function called when there is an error in authentication. Parameter passed to function is the resulting error object |
| options.state | <code>string</code> | Optional string. String will be passed back with the Authorization object as 'state' on a successful authentication |

<a name="AirMapAuth+showAuth"></a>

### airMapAuth.showAuth() ⇒ <code>void</code>
Launches the Auth Modal after checking if a valid auth token is available.

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
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
 This method can be used to retrieve the user's AirMap Id for calls to other AirMap APIs like the Pilot API, which returns a Pilot's profile.

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
**Returns**: <code>string</code> - returns the user's id (if authenticated), null if profile could not be retrieved.  
**Access:** public  
<a name="AirMapAuth+getUserToken"></a>

### airMapAuth.getUserToken() ⇒ <code>string</code>
Retreives a user's id when authenticated. If no auth token exists or if it's invalid, the return value will be null.

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
**Returns**: <code>string</code> - returns the user's token (if authenticated), null if user is not authenticated (active session).  
**Access:** public  
<a name="AirMapAuth+logout"></a>

### airMapAuth.logout(logoutUrl) ⇒ <code>void</code>
Logs out a user by removing the authenticated user token from localStorage and redirects the user (optional).

**Kind**: instance method of <code>[AirMapAuth](#AirMapAuth)</code>  
**Access:** public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| logoutUrl | <code>string</code> | <code>null</code> | If a logout url is provided as a parameter, upon logging out, page will be redirected to the provided url, otherwise no redirect. |

