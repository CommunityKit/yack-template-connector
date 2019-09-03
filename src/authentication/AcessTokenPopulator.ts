import {AccessToken, stringUtils } from "yack-plugin-framework";
export function populateAccessToken(data: any): AccessToken {
    this.pluginContext.logger.d(`populateAccessToken = ${data}`);
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