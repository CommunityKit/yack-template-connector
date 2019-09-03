import { IPlugin, OAuthConfig } from "yack-plugin-framework";
import { TemplateConnector } from "./TemplateConnector";
import { TemplateConfig } from "./config/TemplateConfig";
import { CartalkConfig } from "./config/CartalkConfig";
import { EnvatoConfig } from "./config/EnvatoConfig";


let templateConnector = new TemplateConnector();
// If you need to have multiple different instances of the same plugin source you can create them here
const plugins: IPlugin[] = [templateConnector];
export default plugins;
