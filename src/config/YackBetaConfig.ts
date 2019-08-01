import { IDiscourseConfig } from "./IDiscourseConfig";
import icon from "../assets/yack.base64";

export const YackBetaConfig: IDiscourseConfig = {
    rootUrl: "https://community.yack.io",
    partialUrl: "community.yack.io",
    id: "yack_discourse",
    name: "Yack Beta",
    iconBase64: icon,
    primaryColor: "#1d1e1f",
    secondaryColor: "#434649",
    communityGuidelines: "https://community.yack.io/guidelines",
    yackManagedSession: false
};
