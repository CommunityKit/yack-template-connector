import { IDiscourseConfig } from "./IDiscourseConfig";
// const envato_icon = require("../icons/envato_icon.png");
// import envato from "../assets/envato.base64";
const envato = require("../assets/envato.base64")

export const EnvatoConfig: IDiscourseConfig = {
    rootUrl: "https://forums.envato.com",
    partialUrl: "forums.envato.com",
    id: "envato_discourse",
    name: "Envato",
    iconBase64: envato,
    accentColor: "#81b739"
};
