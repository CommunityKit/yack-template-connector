import { IPluginOAuthClient, OAuthConfig, AccessToken, PluginContext, stringUtils, Result } from "yack-plugin-framework";
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import * as querystring from "querystring";
import DiscoursePluginConfig from "../PluginConfig";
import * as uuid from "uuid";
// import * as forge from 'node-forge'
import { generateKeyPair, generateKeyPairSync, privateDecrypt, publicDecrypt } from "crypto";
import * as nodeUrl from "url";
// import * as constants from 'constants'
// import * as crypto from 'crypto'
// import { Dictionary } from "typescript-collections";
import * as forge from "node-forge";
import { IDiscourseConfig } from "../config/IDiscourseConfig";
import { YackBetaConfig } from "../config/YackBetaConfig";

export class OAuthClient implements IPluginOAuthClient {
    oauthConfig: OAuthConfig = {
        clientId: "discourPlugin",
        userScopeClientId: "anotherRandomString",
        redirectUri: "https://api.discourse.org/api/auth_redirect",
        scopes: ["read", "write", "message_bus", "push", "notifications", "session_info"]
    };

    private pluginContext: PluginContext;
    private config: IDiscourseConfig;

    constructor(context: PluginContext, config: IDiscourseConfig) {
        this.pluginContext = context;
        this.config = config;
    }

    async getUserOAuthLoginUrl(state: string): Promise<Result<string>> {
        const nonce = uuid.v4();

        // Remove dashes from uuid for properly formatted SecureRandom Hex
        const clientWithDash = uuid.v4();
        const regex = /-/g;
        const client = clientWithDash.replace(regex, "");

        const encodedRedirect = encodeURI(this.oauthConfig.redirectUri);

        let url = `${this.config.rootUrl}/user-api-key/new?scopes=read%2Cwrite%2Cmessage_bus%2Cpush%2Cnotifications%2Csession_info&client_id=${client}&nonce=${nonce}&auth_redirect=${this.oauthConfig.redirectUri}&application_name=Discourse&public_key=${DiscoursePluginConfig.yackDiscoursePublicKey}&discourse_app=1`;

        // return url;
        return Result.success(url)
    }

    async getUserAccessTokenFromCode(redirectCallbackUri: string): Promise<Result<AccessToken>> {
        this.pluginContext.logger.d(`user authenticated, redirectUri = ${redirectCallbackUri}`);
        const privateKey = DiscoursePluginConfig.yackDiscoursePrivateKey;

        const decoded = decodeURI(redirectCallbackUri);
        // this.pluginContext.logger.d(`decoded = ${decoded}`);

        const firstParse = nodeUrl.parse(decoded);
        // this.pluginContext.logger.d(`firstParse = ${firstParse}`);

        const secondParse = querystring.parse(firstParse.query);
        // this.pluginContext.logger.d(`secondParse = ${JSON.stringify(secondParse)}`);

        const encryptedPayload = secondParse.payload;
        // this.pluginContext.logger.d(`encryptedPayload = ${encryptedPayload}`);

        let forgePrivateKey = forge.pki.privateKeyFromPem(privateKey);
        // this.pluginContext.logger.d(`forgePrivateKey = ${forgePrivateKey}`);

        const decodedPayload = forge.util.decode64(encryptedPayload);
        // this.pluginContext.logger.d(`decodedPayload = ${decodedPayload}`);

        const decryptedPayload = forgePrivateKey.decrypt(decodedPayload);
        // this.pluginContext.logger.d(`decryptedPayload = ${decryptedPayload}`);

        const accessCode = JSON.parse(decryptedPayload).key;
        // this.pluginContext.logger.d(`accessCode = ${accessCode}`);

        // IMPLEMENT IN NODE BACKEND LATER
        /*
    const payloadBuffer = new Buffer(encryptedPayload, "base64");
    this.pluginContext.logger.d(`payloadBuffer = ${payloadBuffer}`);

    const privateKeyBuffer = new Buffer(privateKey);
    this.pluginContext.logger.d(`privateKeyBuffer = ${privateKeyBuffer}`);

    var options: any = { key: privateKeyBuffer, padding: 'RSA_PKCS1_PADDING'};
    this.pluginContext.logger.d(`options = ${options}`);

    const result: any = crypto.privateDecrypt(options, payloadBuffer);
    this.pluginContext.logger.d(`result = ${result}`);
    
    const accessCode = JSON.parse(Buffer.from(result, 'base64').toString('ascii')).key;
    this.pluginContext.logger.d(`accessCode = ${accessCode}`);
    
    const accessToken = this.populateAccessToken(accessCode);
    this.pluginContext.logger.d(accessToken)
    */

        const accessToken = this.populateAccessToken(accessCode);

        // return accessToken;
        return Result.success(accessToken);
    }

    // For anonymous requests
    async getClientAccessToken(): Promise<Result<AccessToken>> {
        return Result.success(null);
    }

    // ???
    async refreshAccessToken(accessToken: AccessToken): Promise<Result<AccessToken>> {
        // const basicAuthCredentials = `${this.oauthConfig.clientId}:password`;
        // const config: AxiosRequestConfig = {
        //     baseURL: "https://www.reddit.com/api/v1",
        //     headers: {
        //         Authorization: `Basic ${btoa(basicAuthCredentials)}`
        //     }
        // };

        // const postData = {
        //     grant_type: "refresh_token",
        //     refresh_token: accessToken.refreshToken
        // };

        // const response = await this.pluginContext.axios.post("/access_token/", querystring.stringify(postData), config);
        // this.ensureSuccess(response);
        // const newAccessToken = this.populateAccessToken(response.data);
        // //renewing with access token doesn't return the refresh token again.
        // if (!newAccessToken.refreshToken && accessToken.refreshToken) {
        //     newAccessToken.refreshToken = accessToken.refreshToken;
        // }
        return null;
        // return Result.success(newAccessToken)
        // return newAccessToken;
    }

    private populateAccessToken(data: any): AccessToken {
        this.pluginContext.logger.d(`populateAccessToken = ${data}`)
        const token: AccessToken = {
            // Need to replace this
            token: data,
            refreshToken: data["refresh_token"],
            deviceId: data["device_id"],
            expiresInSeconds: 15552000,
            scope: data["scope"],
            tokenType: data["token_type"],
            utcCreateDate: Date.now()
        };
        return token;
    }

    private ensureSuccess(response: AxiosResponse<any>) {
        const error = response.data["error"];
        const errorDetails = response.data;

        if (error) {
            throw new Error(JSON.stringify(errorDetails));
        }
    }
}

// {{base}}/session/current.json
// {{base}}}/admin/site_settings.json
