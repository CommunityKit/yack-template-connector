import {
    IChannelProvider,
    Channel,
    PluginRequestOptions,
    PagedArray,
    PluginContext,
    objectUtils,
    // PostType,
    Category,
    Filter,
    TextContent,
    // ObjectAction
} from "yack-plugin-framework";
import * as URLAssembler from "url-assembler";
import DiscoursePluginConfig from "./DiscoursePluginConfig";
import { IDiscourseConfig } from "./config/IDiscourseConfig";
import { DiscourseChannelPopulator } from "./populators/DiscourseChannelPopulator";
import { DiscourseFilters } from "./DiscourseFilters";

export class DiscourseChannelProvider implements IChannelProvider {
    private pluginContext: PluginContext;
    private config: IDiscourseConfig;

    constructor(context: PluginContext, config: IDiscourseConfig) {
        this.pluginContext = context;
        this.config = config;
    }

    // setConfig(config: IDiscourseConfig) {}

    // TBD
    async getCategories(options: PluginRequestOptions): Promise<PagedArray<Category>> {
        return new PagedArray();
    }

    // DO THIS
    async getFixedChannels(options: PluginRequestOptions): Promise<Channel[]> {
        let fixedChannels: Channel[];
        if (!!options.session.user == false) {
            fixedChannels = [
                {
                    id: "fixed:latest",
                    icon: Channel.Icons.home,
                    name: "latest",
                    description: {type: TextContent.Types.plain, value: "The latest topics"},
                    threadsFilters: this.getLatestChannelSortFilters(options)
                },
                {
                    id: "top:popular",
                    icon: Channel.Icons.popular,
                    name: "top",
                    description: {type: TextContent.Types.plain, value: "All top trending topics"},
                    threadsFilters: this.getTopChannelFilters(options)
                }
            ];
        } else if (!!options.session.user) {
            fixedChannels = [
                {
                    id: "fixed:latest",
                    icon: Channel.Icons.home,
                    name: "latest",
                    description: {type: TextContent.Types.plain, value: "The latest topics"},
                    threadsFilters: this.getLatestChannelSortFilters(options)
                },
                {
                    id: "top:popular",
                    icon: Channel.Icons.popular,
                    name: "top",
                    description: {type: TextContent.Types.plain, value: "All top trending topics"},
                    threadsFilters: this.getTopChannelFilters(options)
                },
                { id: "unread", icon: Channel.Icons.default, name: "unread", description: {type: TextContent.Types.plain, value: "Your unread topics"}, threadsFilters: [] }
            ];
        }
        return fixedChannels;
    }

    async getAllChannels(options: PluginRequestOptions, categoryId?: string): Promise<PagedArray<Channel>> {
        return new PagedArray();
    }

    // async getChannels(options: PluginRequestOptions): Promise<PagedArray<Channel>> {
    //     let channels: PagedArray<Channel>;

    //     if (options.session.user) {
    //         channels = await this.getUserChannels(options);
    //     } else {
    //         channels = await this.getDefaultChannels(options);
    //     }
    //     return channels;
    // }

    // TBD
    async getChannelsByCategoryId(options: PluginRequestOptions, categoryId: string): Promise<PagedArray<Channel>> {
        return new PagedArray();
    }

    // TBD
    async getChannelInfo(options: PluginRequestOptions, channelId: string): Promise<Channel> {
        return null;
    }

    // TBD
    // async saveChannelAction(options: PluginRequestOptions, channelId: string, actionItem: ObjectAction.Item): Promise<void> {}

    private getTopChannelFilters(options: PluginRequestOptions): Filter[] {
        const topThreadsFilters = objectUtils.clone(DiscourseFilters.TOP_THREADS_FILTERS);
        return topThreadsFilters;
    }

    private getLatestChannelSortFilters(options: PluginRequestOptions): Filter[] {
        const latestFilters = objectUtils.clone(DiscourseFilters.LATEST_CATEGORY_SORT_ALPHABETICALLY);
        return latestFilters;
    }

    // async getDefaultChannels(options: PluginRequestOptions): Promise<PagedArray<Channel>> {
    //     const url = `${this.config.rootUrl}/categories.json`;
    //     const response = await this.pluginContext.axios.get(url);

    //     const categoriesList = response.data.category_list.categories;

    //     const channels = new PagedArray<Channel>();

    //     for (const channelItem of categoriesList) {
    //         const channel = DiscourseChannelPopulator.populateChannel(channelItem, options.session.user);
    //         channels.array.push(channel);
    //     }

    //     return channels;
    // }

    async getChannelsByUserId(options: PluginRequestOptions, userId: string): Promise<PagedArray<Channel>> {
        const channels = new PagedArray<Channel>();

        if (options.session.user) {
            let url: string;
            url = `${this.config.rootUrl}/site.json`;
    
            const channelsResponse = await this.pluginContext.axios.get(url, {
                responseType: "json",
                headers: {
                    "user-api-key": options.session.accessToken.token
                }
            });
            const categoryList = channelsResponse.data.categories;
    
            for (const channelItem of categoryList) {
                // HIDE channels if they don't have any topics
                // if(channelItem.topic_count > 0){
                const channel = DiscourseChannelPopulator.populateChannel(channelItem, options.session.user);
                channels.array.push(channel);
                // }
            }

        }else{

            const url = `${this.config.rootUrl}/categories.json`;
        const response = await this.pluginContext.axios.get(url);

        const categoriesList = response.data.category_list.categories;


        for (const channelItem of categoriesList) {
            const channel = DiscourseChannelPopulator.populateChannel(channelItem, options.session.user);
            channels.array.push(channel);
        }

        }
        return channels;
    }

    async getChannelById(options: PluginRequestOptions, channelId: string): Promise<Channel> {
        return null;
    }

    // async getUserChannels(options: PluginRequestOptions): Promise<PagedArray<Channel>> {
    //     let url: string;
    //     url = `${this.config.rootUrl}/site.json`;

    //     const channelsResponse = await this.pluginContext.axios.get(url, {
    //         responseType: "json",
    //         headers: {
    //             "user-api-key": options.session.accessToken.token
    //         }
    //     });
    //     const channels = new PagedArray<Channel>();
    //     const categoryList = channelsResponse.data.categories;

    //     for (const channelItem of categoryList) {
    //         // HIDE channels if they don't have any topics
    //         // if(channelItem.topic_count > 0){
    //         const channel = DiscourseChannelPopulator.populateChannel(channelItem, options.session.user);
    //         channels.array.push(channel);
    //         // }
    //     }
    //     return channels;
    // }
    async getChannelByThreadId(options: PluginRequestOptions, threadId: string): Promise<Channel> {
        return null;
    }
}
