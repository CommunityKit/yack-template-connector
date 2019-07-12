import {
  PluginUser,
  Channel,
  TextContent
} from "yack-plugin-framework";

export namespace DiscourseChannelPopulator {
  export function populateChannel(data: any, sessionUser: PluginUser): Channel {
    // const channel = new Channel();
    const channel: Channel = {
       id: data.id.toString(),
       icon: Channel.Icons.default,
       name: data.name,
       ...sessionUser && {canSessionUserPostNewThread: true}
    }

    
    // channel.title = data.name;
    channel.description = {type: TextContent.Types.plain, value: data.description};
    channel.nsfw = false;

    const metadataList = ["color", "slug", "topic_count", "post_count", "position", "topic_url"];
    const metaHsh = {};
    metadataList.forEach(item => (metaHsh[item] = data[item]));
    channel.metadata = metaHsh;

    // ??? Categories don't have activeUserCount OR Subscribers but we could use either post_count OR topic_count instead
    // ... categories do have engaged Users list but we'd have to fetch that separately
    // channel.activeUserCount = data["active_user_count"];
    // channel.subscriberCount = data["subscribers"];

    // ??? Discourse Users have the option to (watching, tracking, normal, or muted) but ONLY on Topics not Categories
    // channel.userIsSubscriber = objectUtils.parseBoolean(data["user_is_subscriber"]);
    // channel.userHasFavorited = objectUtils.parseBoolean(data["user_has_favorited"]);

    return channel;
}
}