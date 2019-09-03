import { PluginRequestOptions, PluginUser, objectUtils, PluginContext, Result } from "yack-plugin-framework";
import * as URLAssembler from "url-assembler";
// import DiscoursePluginConfig from "../PluginConfig";
import { IDiscourseConfig } from "../config/IDiscourseConfig";
import { populateUser } from "./UserPopulator"
import { getUserStats, getUserData } from "./UserRequests";

/**
 * We're using test data to populate users in this template example from: https://jsonplaceholder.typicode.com
 */


export class UserProvider {
    private pluginContext: PluginContext;
    config = {rootUrl: ""}

    constructor(context: PluginContext) {
        this.pluginContext = context;
    }

    /**
     * Gets called immediately after OAuthClient.getUserAccessTokenFromCode() for any authenticated request
     */
    async getSelf(options: PluginRequestOptions): Promise<Result<PluginUser>> {

        /**
         * FIND THE CURRENT SESSION URL
         * Discourse Example Current Session: `${rootUrl}/session/current.json`
         * Reddit Example: `https://oauth.reddit.com/api/v1/me`
        */ 

        // TEST DATA
        let sessionURL = `https://jsonplaceholder.typicode.com/users/1`;

        /**
         * DON'T FORGET TO SET AUTH HEADERS IN REQUESTS
         * Our example content doesn't require headers but yours likely will
         * --------------------------------------
         * 
         * ```ts
         * const authorizationHeaders = {
         *      headers: {
         *          "ExampleHeader": options.session.accessToken.token
         *      }
         * };
         * 
         * const response = await this.pluginContext.axios.get(sessionURL, authorizationHeaders);
         * ```
         */

        const response = await this.pluginContext.axios.get(sessionURL);

        const userData = response.data;
        // this.pluginContext.logger.d(`userData = ${userData}`)

        const pluginUser = populateUser(userData, this.config.rootUrl )
        return Result.success(pluginUser);
    }
    async getUser(options: PluginRequestOptions, userQuery: PluginUser.Query): Promise<Result<PluginUser>> {
        const userId = userQuery.username
        let allData;
        await Promise.all(
            [getUserStats(this.config.rootUrl, this.pluginContext.axios.get, userId, options, this.config),
            getUserData(this.config.rootUrl, this.pluginContext.axios.get, userId, options, this.config)
        ]).then(data => {
            allData = {
                summary: data[0].user_summary,
                badges: data[1].badges,
                userInfo: data[1].user
            }
        })

        const user = populateUser(allData, this.config.rootUrl)
        return Result.success(user);
    }

    async getUserByUserName(options: PluginRequestOptions, username: string): Promise<Result<PluginUser>> {
        // userID === username
        let allData;
        await Promise.all(
            [getUserStats(this.config.rootUrl, this.pluginContext.axios.get, username, options, this.config),
            getUserData(this.config.rootUrl, this.pluginContext.axios.get, username, options, this.config)
        ]).then(data => {
            allData = {
                summary: data[0].user_summary,
                badges: data[1].badges,
                userInfo: data[1].user
            }
        })

        const user = populateUser(allData, this.config.rootUrl)
        return Result.success(user);
    }
}
