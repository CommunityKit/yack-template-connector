import { IDiscourseConfig } from "./IDiscourseConfig";
// import yack from "../assets/yack.base64";
const yack = require("../assets/yack.base64")

export const YackBetaConfig: IDiscourseConfig = {
    rootUrl: "https://community.yack.io",
    partialUrl: "community.yack.io",
    id: "yack_discourse",
    name: "Yack Beta",
    iconBase64: yack,
    accentColor: "#144C94"
};
