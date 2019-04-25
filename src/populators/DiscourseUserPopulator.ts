import {
    Thread,
    upndown,
    PluginUser,
    objectUtils,
    stringUtils,
    Attachment,
    AttachmentType,
    AttachmentProviderType,
    urlUtils,
    ContentType,
    Thumbnails,
    Thumbnail,
    Channel,
    Comment,
    PostType
} from "yack-plugin-framework";

export namespace DiscourseUserPopulator {
    export function populateUser(data: any): PluginUser {
        // ADDING SIZE TO PHOTO URLS
        let avatar;
        if(data.avatar_template.includes("https:")){
            avatar = data.avatar_template.replace("{size}", "240")
            // const ava = `https://avatars.discourse.org/v2/letter/c/da6949/{size}.png`
        }else{
            const ava = data.avatar_template;
            const regex = /{size}/g;
            const photoSized = ava.replace("{size}", "240");
            avatar = `https://discourse-cdn-sjc1.com/${data.communityName}${photoSized}`
        }

        const user: PluginUser ={
            // id: data.id.toString(),
            id: data.username,

            username: data.username,
            fullName: data.name,
            profileImageUrl: avatar
        };
        return user;
    }
}
