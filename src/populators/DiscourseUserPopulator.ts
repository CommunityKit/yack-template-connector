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
        const avatar = data.avatar_template;
        const regex = /{size}/g;
        const photoSized = avatar.replace(regex, "120");

        const user: PluginUser ={
            id: data.id,
            username: data.username,
            fullName: data.name,
            profileImageUrl: photoSized
        };
        return user;
    }
}
