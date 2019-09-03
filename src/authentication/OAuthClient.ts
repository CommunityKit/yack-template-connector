import { IPluginOAuthClient, OAuthConfig, AccessToken, PluginContext, stringUtils, Result } from "yack-plugin-framework";
import {AxiosResponse } from "axios";
import * as querystring from "querystring";
import * as uuid from "uuid";
import * as nodeUrl from "url";

/**
 * For templating purposes we're using the OAuth Playground found at https://www.oauth.com/playground 
 * 
 * The OAuth Playground provides an excellent walk-through of how oAuth works. To follow along with the walk-through
 * generate your own auth key/value pairs here to start the tutorial:
 * https://www.oauth.com/playground/client-registration.html?returnto=authorization-code.html#
 * 
 * The resulting auth data should look something like the below values.
 * 
 * Several organizations provide their very own oAuth playground which may be more useful to you as the developer.
 * --------------------------------------
 * 
 * Client Registration
 * client_id: 0oanavjjjpf3OydwG0h7
 * client_secret: BKdBbw26qgRuz4CTmnTRP6TAKeTYGFzk9uquhOJI
 * --------------------------------------
 * 
 * Registered Redirect URIs	
 * https://www.oauth.com/playground/authorization-code.html
 * https://www.oauth.com/playground/authorization-code-with-pkce.html
 * --------------------------------------
 * 
 * Supported Grant Types
 * authorization_code, refresh_token, implicit
 * --------------------------------------
 * 
 * User Account
 * login: fancy-emu@example.com
 * password: Inexpensive-Alligator-Xanthous-Magpie-5
 */

export class OAuthClient implements IPluginOAuthClient {
    oauthConfig: OAuthConfig = {
        clientId: "0oanavjjjpf3OydwG0h7",
        userScopeClientId: "0oanavjjjpf3OydwG0h7",
        redirectUri: "https://www.oauth.com/playground/authorization-code.html",
        // Scopes are unique per each Connector source and should be mentioned in the source's docs
        scopes: ["photo","offline_access"]
        // Example Discourse scopes: ["read", "write", "message_bus", "push", "notifications", "session_info"]
    };
    stateNonce: string = "HQfoqQxUAcz1wVVz"


    private pluginContext: PluginContext;

    constructor(context: PluginContext) {
        this.pluginContext = context;
    }

    async getUserOAuthLoginUrl(state: string): Promise<Result<string>> {
        /**
         * Sometimes the oAuth flow will require randomly generated strings of a certain length to be passed to the server.
         * We use uuid to generate these:
         * `const randNonce = uuid.v4();`
         * 
         * 
         * Remove dashes from uuid generated value for a properly formatted SecureRandom Hex
         * 
         * ```ts
         * const regex = /-/g;
         * const randNoneClean = randNonce.replace(regex, "");
         * ```
         * Docs: https://www.npmjs.com/package/uuid
         */


        // Sometimes your need to ensure the redirect url is properly uri encoded
        // const encodedRedirect = encodeURI(this.oauthConfig.redirectUri);

        /**
         * GENERATE YOUR OWN NONCE
         * ```ts
         * const randNonce = uuid.v4();
         * const regex = /-/g;
         * state = randNonce.replace(regex, "");```
         * 
         */

         // In the case of oAuth playground we're given a nonce/state but you can also use one you generate yourself
        //  state = "HQfoqQxUAcz1wVVz"

        let url = `https://dev-396343.oktapreview.com/oauth2/default/v1/authorize?response_type=code&client_id=${this.oauthConfig.clientId}&redirect_uri=${this.oauthConfig.redirectUri}&scope=photo+offline_access&state=${this.stateNonce}`;

        // return url;
        return Result.success(url);
    }

    async getUserAccessTokenFromCode(redirectCallbackUri: string): Promise<Result<AccessToken>> {
        /**
         * Example redirectCallbackUri
         * "https://www.oauth.com/playground/authorization-code.html?code=Ka1Q6SsPfGxmahwVnjWE&state=HQfoqQxUAcz1wVVz"
         */

        const params = querystring.parse(redirectCallbackUri);
        if (params["error"]) {
            throw new Error(params["error"] as string);
        }

        console.log("redirectCallbackUri" + JSON.stringify(redirectCallbackUri));

        const accessToken = this.populateAccessToken(params.code);

        const state = params.state;
        
        /**
         * 
         * "Since it's possible for an attacker to craft a GET request that looks similar to this, an attacker could provide your application with junk authorization codes. You need to first verify that the **state** parameter matches this user's session so that you can be sure you initiated the request, and are only sending an authorization code that was intended for your client."
         * Source: https://www.oauth.com/playground
         */
        if(this.stateNonce === state){
            return Result.success(accessToken);
        }
    }

    // For anonymous requests
    async getClientAccessToken(): Promise<Result<AccessToken>> {
        return Result.success(null);
    }

    // Need to implement
    async refreshAccessToken(accessToken: AccessToken): Promise<Result<AccessToken>> {
        return null;
    }

    private populateAccessToken(data: any): AccessToken {
        this.pluginContext.logger.d(`populateAccessToken = ${data}`);
        const token: AccessToken = {
            // Need to replace this
            token: data,
            refreshToken: '',
            deviceId: '',
            expiresInSeconds: 15552000,
            scope: '',
            tokenType: "bearer",
            utcCreateDate: Date.now()
        };
        return token;
    }
}