import {
  PluginUser,
  Channel,
  TextContent
} from "yack-plugin-framework";

  export function populateChannel(data: any): Channel {
    // const channel = new Channel();
    const channel: Channel = {
    id: data.id.toString(),
    icon: Channel.Icons.default,
    iconUrl: data.profile_photo,
    name: data.name,
    description: data.description,
     nsfw: data.nsfw,    
     subscriptionCount: data.subscriptions,
     subscriberCount: data.subscribers
    }
    return channel;

}
