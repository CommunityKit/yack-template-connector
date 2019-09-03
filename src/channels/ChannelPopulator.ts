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
    name: data.username,
    description: data.name,
     nsfw:false,    
    }
    return channel;

}
