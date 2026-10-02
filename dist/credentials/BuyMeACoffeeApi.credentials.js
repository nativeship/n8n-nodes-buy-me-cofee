"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyMeACoffeeApi = void 0;
class BuyMeACoffeeApi {
    constructor() {
        this.name = "buyMeACoffeeApi";
        this.displayName = "Buy Me A Coffee API";
        this.documentationUrl = "https://developers.buymeacoffee.com/api/v1";
        this.icon = {
            light: "file:../nodes/BuyMeACoffee/buyMeACoffee.svg",
            dark: "file:../nodes/BuyMeACoffee/buyMeACoffee.dark.svg"
        };
        this.properties = [
            {
                displayName: "Access Token",
                name: "secret",
                type: "string",
                typeOptions: {
                    password: true
                },
                default: "",
                required: true
            }
        ];
        this.authenticate = {
            type: "generic",
            properties: {
                headers: {
                    Authorization: "=Bearer {{$credentials.secret}}"
                }
            }
        };
        this.test = {
            request: {
                baseURL: "https://developers.buymeacoffee.com/api/v1",
                url: "/extras"
            }
        };
    }
}
exports.BuyMeACoffeeApi = BuyMeACoffeeApi;
//# sourceMappingURL=BuyMeACoffeeApi.credentials.js.map