import { type IAuthenticateGeneric, type Icon, type ICredentialTestRequest, type ICredentialType, type INodeProperties } from "n8n-workflow";

// Generated with ts-morph
export class BuyMeACoffeeApi implements ICredentialType {
  name = "buyMeACoffeeApi";
  displayName = "Buy Me A Coffee API";
  documentationUrl = "https://developers.buymeacoffee.com/api/v1";
  icon: Icon = {
        light: "file:../nodes/BuyMeACoffee/buyMeACoffee.svg",
        dark: "file:../nodes/BuyMeACoffee/buyMeACoffee.dark.svg"
    };
  properties: INodeProperties[] = [
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
  authenticate: IAuthenticateGeneric = {
        type: "generic",
        properties: {
            headers: {
                Authorization: "=Bearer {{$credentials.secret}}"
            }
        }
    };
  test: ICredentialTestRequest = {
        request: {
            baseURL: "https://developers.buymeacoffee.com/api/v1",
            url: "/extras"
        }
    };
}
