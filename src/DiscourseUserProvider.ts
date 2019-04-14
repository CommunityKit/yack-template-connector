import { PluginRequestOptions, PluginUser, objectUtils, PluginContext } from "yack-plugin-framework";
import * as URLAssembler from "url-assembler";
import DiscoursePluginConfig from "./DiscoursePluginConfig";
import { IDiscourseConfig } from "./config/IDiscourseConfig";

export class DiscourseUserProvider {
    private pluginContext: PluginContext;
    private config: IDiscourseConfig;

    constructor(context: PluginContext, config: IDiscourseConfig) {
        this.pluginContext = context;
        this.config = config;
    }
    async getSelf(options: PluginRequestOptions): Promise<PluginUser> {
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
            id: userData.id,
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

        return pluginUser;
    }
    async getUser(options: PluginRequestOptions, userId: string): Promise<PluginUser> {
        // let user = new PluginUser();
        //   return user;
        return null;
    }
    // async saveUserAction(options: PluginRequestOptions, actionItem: ObjectAction.Item): Promise<void> {}
}
