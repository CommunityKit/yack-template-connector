import { PluginRequestOptions, PluginUser, objectUtils, PluginContext, Result } from "yack-plugin-framework";
import * as URLAssembler from "url-assembler";
import DiscoursePluginConfig from "../PluginConfig";
import { IDiscourseConfig } from "../config/IDiscourseConfig";
import { populateUser } from "./UserPopulator"
import { getUserStats, getUserData } from "./UserRequests";

export class UserProvider {
    private pluginContext: PluginContext;
    private config: IDiscourseConfig;

    constructor(context: PluginContext, config: IDiscourseConfig) {
        this.pluginContext = context;
        this.config = config;
    }
    async getSelf(options: PluginRequestOptions): Promise<Result<PluginUser>> {
        // ??? In Discourse you fetch the user by username... How are we retrieving this?
        let sessionURL = `${this.config.rootUrl}/session/current.json`;

        const response = await this.pluginContext.axios.get(sessionURL, {
            headers: {
                "user-api-key": `${options.session.accessToken.token}`
            }
        });

        // this.pluginContext.logger.d(`USER RESPONSE = ${JSON.stringify(response)}`);

        const userData = response.data.current_user;
        // this.pluginContext.logger.d(`userData = ${userData}`)

        const metadataList = ["admin", "title"];
        // ### Would need to fetch the specific user to retrieve this additional info for metadata
        // {"last_posted_at", "last_seen_at", "badge_count", "profile_view_count"}
        const metadata = {};
        metadataList.forEach(item => (metadata[item] = userData[item]));

        const pluginUser:PluginUser = {
            // id: userData.id.toString(),
             
            // Changing id from number in API to username b/c requests have to be made with username in getUser()
            id: userData.username,

            // username: 'katrina',
            username: userData.username,
            // ### Would need to fetch the specific user to retrieve these fields
            // about: userData["bio_excerpt"],
            // utcCreateDate: userData.created_at,
            moderator: userData.moderator,

            fullName: userData.name,
            // ??? Is the user email necessary... User emails are protected by staff API key
            // See Forum Discussion: https://meta.discourse.org/t/get-user-email-emails-json-seems-not-working/83477
            // email: "",

            profileImageUrl: `https://discourse-cdn-sjc2.com/standard17/${this.config.partialUrl}/${userData.username}/240/4_2.png`,

            // ??? Are tags the same thing as groups in Discourse... Or what is the use case
            // tags: "",
            // *** Get user badges
            metadata: metadata

            // ### Need to evetually figure out permissions
            // Eg. "can_create_topic": true,
            // "link_posting_access": "full",
        };

        // return pluginUser;
        return Result.success(pluginUser);
    }
    async getUser(options: PluginRequestOptions, userQuery: PluginUser.Query): Promise<Result<PluginUser>> {
        const userId = userQuery.username
        // userID === username
        let allData;
        await Promise.all(
            [getUserStats(this.config.rootUrl, this.pluginContext.axios.get, userId, options),
            getUserData(this.config.rootUrl, this.pluginContext.axios.get, userId, options)
        ]).then(data => {
            allData = {
                summary: data[0].user_summary,
                badges: data[1].badges,
                userInfo: data[1].user
            }
        })

        allData.partialUrl = this.config.partialUrl
        allData.communityName = this.config.id.replace("_discourse","")

        const user = populateUser(allData, this.config.rootUrl)
        // let user = new PluginUser();
        //   return user;
        return Result.success(user);
    }

    async getUserByUserName(options: PluginRequestOptions, username: string): Promise<Result<PluginUser>> {
        // userID === username
        let allData;
        await Promise.all(
            [getUserStats(this.config.rootUrl, this.pluginContext.axios.get, username, options),
            getUserData(this.config.rootUrl, this.pluginContext.axios.get, username, options)
        ]).then(data => {
            allData = {
                summary: data[0].user_summary,
                badges: data[1].badges,
                userInfo: data[1].user
            }
        })

        allData.partialUrl = this.config.partialUrl
        allData.communityName = this.config.id.replace("_discourse","")
        

        const user = populateUser(allData, this.config.rootUrl)
        // let user = new PluginUser();
        //   return user;
        return Result.success(user);
    }
    // async saveUserAction(options: PluginRequestOptions, actionItem: ObjectAction.Item): Promise<void> {}
}
