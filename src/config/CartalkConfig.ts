import { IDiscourseConfig } from "./IDiscourseConfig";
// const cartalk_icon = require("../icons/cartalk_icon.png");
// import cartalk from "../assets/cartalk.base64";
const cartalk = require("../assets/cartalk.base64")

export const CartalkConfig: IDiscourseConfig = {
    rootUrl: "https://community.cartalk.com",
    partialUrl: "community.cartalk.com",
    id: "cartalk_discourse",
    name: "Cartalk",
    iconBase64: cartalk,
    accentColor: "#b90b26"
};
