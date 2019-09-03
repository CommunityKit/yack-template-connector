import { PluginUser } from "yack-plugin-framework";
import { setDateFormat as format, kFormatter } from "../utils/PluginUtils";
import { userInfo } from "os";
import { stat } from "fs";

export function populateUser(data: any, rootUrl: string): PluginUser {

    const user: PluginUser = {
        // summary badges userInfo
        id: data.username,
        username: data.username,
        fullName: data.name,
        about: data.company.catchPhrase,
        utcCreateDate: Date.now(),
        moderator: false,
        metadata: {}
    };

    return user;
}