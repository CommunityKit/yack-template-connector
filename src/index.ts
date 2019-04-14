import { IPlugin, OAuthConfig } from "yack-plugin-framework";
import { DiscoursePlugin } from "./DiscoursePlugin";
import { YackBetaConfig } from "./config/YackBetaConfig";
import { CartalkConfig } from "./config/CartalkConfig";
import { EnvatoConfig } from "./config/EnvatoConfig";

let yackBeta = new DiscoursePlugin(YackBetaConfig);
let carTalk = new DiscoursePlugin(CartalkConfig);
let envato = new DiscoursePlugin(EnvatoConfig);
const plugins: IPlugin[] = [yackBeta, carTalk, envato];
export default plugins;
