import {
    IChannelProvider,
    Channel,
    PluginRequestOptions,
    PagedArray,
    PluginContext,
    objectUtils,
    Category,
    Filter,
    TextContent,
    Result,
    PluginUser
} from "yack-plugin-framework";
import { IDiscourseConfig } from "../config/IDiscourseConfig";
import { ChannelPopulator } from "./ChannelPopulator";
import * as filter from "../search/Filters";

export class ChannelProvider implements IChannelProvider {
    private pluginContext: PluginContext;
    private config: IDiscourseConfig;

    constructor(context: PluginContext, config: IDiscourseConfig) {
        this.pluginContext = context;
        this.config = config;
    }

    // setConfig(config: IDiscourseConfig) {}

    // TBD
    async getCategories(options: PluginRequestOptions): Promise<Result<PagedArray<Category>>> {
        return Result.success(new PagedArray());
    }

    // DO THIS
    async getFixedChannels(options: PluginRequestOptions): Promise<Result<Channel[]>> {
        let fixedChannels: Channel[];
        if (!options.session.user) {
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
        return Result.success(fixedChannels)
        // return fixedChannels;
    }

    async getAllChannels(options: PluginRequestOptions, categoryId?: string): Promise<PagedArray<Channel>> {
        return new PagedArray();
    }

    // TBD
    async getChannelsByCategoryId(options: PluginRequestOptions, categoryId: string): Promise<PagedArray<Channel>> {
        return new PagedArray();
    }

    // TBD
    async getChannelInfo(options: PluginRequestOptions, channelId: string): Promise<Channel> {
        return null;
    }

    private getTopChannelFilters(options: PluginRequestOptions): Filter[] {
        const topThreadsFilters = objectUtils.clone(filter.TOP_THREADS_FILTERS);
        return topThreadsFilters;
    }

    private getLatestChannelSortFilters(options: PluginRequestOptions): Filter[] {
        const latestFilters = objectUtils.clone(filter.LATEST_CATEGORY_SORT_ALPHABETICALLY);
        return latestFilters;
    }

    async getChannelsByUser(options: PluginRequestOptions, userQuery: PluginUser.Query): Promise<Result<PagedArray<Channel>>> {
        const channels = new PagedArray<Channel>();
        if (!!options.session.user) {
            const userId = userQuery.id;

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
                // parent_category_id
                
                if("parent_category_id" in channelItem){
                    const parentSlug = categoryList.filter(elem => elem.id === channelItem.parent_category_id)[0]
                    channelItem.slug = `${parentSlug.slug}/${channelItem.slug}`
                }

                // HIDE channels if they don't have any topics
                // if(channelItem.topic_count > 0){
                const channel = ChannelPopulator.populateChannel(channelItem, options.session.user);
                channels.array.push(channel);
                // }
            }

        }else{
            const url = `${this.config.rootUrl}/categories.json`;
        const response = await this.pluginContext.axios.get(url);

        const categoriesList = response.data.category_list.categories;


        for (const channelItem of categoriesList) {
            const channel = ChannelPopulator.populateChannel(channelItem, options.session.user);
            channels.array.push(channel);
        }

        }
        return Result.success(channels)
        // return channels;
    }

    async getChannel(options: PluginRequestOptions, channelQuery: Channel.Query): Promise<Result<Channel>> {
        const channelId = channelQuery.id;
        let url: string;
        let resp;
            url = `${this.config.rootUrl}/categories.json`;
            if(options.session.user){
            resp = await this.pluginContext.axios.get(url, {
                responseType: "json",
                headers: {
                    "user-api-key": options.session.accessToken.token
                }
            });
        }else{
            resp = await this.pluginContext.axios.get(url)
        }

        const channelsList = resp.data.category_list.categories
        const channelItem = channelsList.filter(elem => elem.id === parseInt(channelId))[0]
        const channel = ChannelPopulator.populateChannel(channelItem, options.session.user);
        return Result.success(channel)
        // return channel;
    }

    async getChannelByThreadId(options: PluginRequestOptions, threadId: string): Promise<Channel> {
        return null;
    }
}
