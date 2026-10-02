import { NodeConnectionTypes, NodeApiError, NodeOperationError, type IDataObject, type IExecuteFunctions, type IHttpRequestOptions, type INodeExecutionData, type INodeType, type INodeTypeDescription, type JsonObject } from "n8n-workflow";
import { requestWithRetry } from "../../shared/http";

// Generated with ts-morph
type CredentialApplication = { credentialType: string; type: 'apiKey' | 'basic' | 'bearer' | 'oauth2' | 'custom'; location?: 'header' | 'query'; parameter?: string; injections?: Array<{ target: 'header' | 'query' | 'body'; name: string; value: string }> };
type RetryContract = { mode: string; retryConnectionFailures?: boolean; retryTimeouts?: boolean; retryRateLimits?: boolean; retryServerErrors?: boolean; maxAttempts: number; maxElapsedMs: number; baseBackoffMs: number; maxBackoffMs: number; jitterRatio: number; idempotency?: { target: 'header' | 'query' | 'body'; parameter: string } };
type PaginationContract = { style: string; page?: string; limit?: string; cursor?: string; responseCursor?: string; hasMore?: string; itemPath?: string; advancement?: string; maxPages: number; maxItems: number; maxElapsedMs: number; maxMemoryBytes: number; repeatedCursorLimit: number; repeatedPageLimit: number; pageSize: number };





function selectResponseFields(value: IDataObject, fields: string[]): IDataObject {
  if (fields.length === 0) return value;
  const selected: IDataObject = {};
  if (value.id !== undefined) selected.id = value.id;
  for (const field of fields) if (value[field] !== undefined) selected[field] = value[field];
  return selected;
}

function valueAtPath(value: unknown, path: string): unknown {
  if (!path) return value;
  return path.split('.').filter(Boolean).reduce((current: unknown, segment) => {
    if (current === undefined || current === null) return undefined;
    if (Array.isArray(current)) return current[Number(segment)];
    return (current as IDataObject)[segment];
  }, value);
}

export class BuyMeACoffee implements INodeType {
  description: INodeTypeDescription = {
        displayName: "Buy Me a Coffee",
        name: "buyMeACoffee",
        icon: {
            light: "file:buyMeACoffee.svg",
            dark: "file:buyMeACoffee.dark.svg"
        },
        group: [],
        version: [
            1
        ],
        subtitle: "={{((JSON.parse(\"\\u007b\\\"extras\\\":\\u007b\\\"getExtraById\\\":\\\"getExtraPurchase: extra\\\",\\\"listExtras\\\":\\\"listExtrasPurchases: extra\\\"\\u007d,\\\"members\\\":\\u007b\\\"getMemberById\\\":\\\"getMember: member\\\",\\\"listMembers\\\":\\\"listMembers: member\\\"\\u007d,\\\"supporters\\\":\\u007b\\\"getSupporterById\\\":\\\"getSupporter: supporter\\\",\\\"listSupporters\\\":\\\"listSupporters: supporter\\\"\\u007d\\u007d\"))[$parameter[\"resource\"]] || {})[$parameter[\"operation\"]] || ($parameter[\"operation\"] + \": \" + $parameter[\"resource\"])}}",
        description: "Helps creators receive support, offer memberships, and sell products.",
        documentationUrl: "https://developers.buymeacoffee.com/api/v1",
        hints: [
            {
                message: "Operation \"listExtras\" looks paginated, but no explicit safe Pagination Contract is available. The generated operation remains single-page until an explicit bounded Pagination Contract is provided.",
                type: "warning",
                location: "inputPane",
                whenToDisplay: "always"
            },
            {
                message: "Operation \"listMembers\" looks paginated, but no explicit safe Pagination Contract is available. The generated operation remains single-page until an explicit bounded Pagination Contract is provided.",
                type: "warning",
                location: "inputPane",
                whenToDisplay: "always"
            },
            {
                message: "Operation \"listSupporters\" looks paginated, but no explicit safe Pagination Contract is available. The generated operation remains single-page until an explicit bounded Pagination Contract is provided.",
                type: "warning",
                location: "inputPane",
                whenToDisplay: "always"
            }
        ],
        defaults: {
            name: "Buy Me a Coffee"
        },
        usableAsTool: true,
        inputs: [
            NodeConnectionTypes.Main
        ],
        outputs: [
            NodeConnectionTypes.Main
        ],
        credentials: [
            {
                name: "buyMeACoffeeApi",
                required: true
            }
        ],
        properties: [
            {
                displayName: "Resource",
                name: "resource",
                type: "options",
                noDataExpression: true,
                default: "extras",
                options: [
                    {
                        name: "Extra",
                        value: "extras"
                    },
                    {
                        name: "Member",
                        value: "members"
                    },
                    {
                        name: "Supporter",
                        value: "supporters"
                    }
                ]
            },
            {
                displayName: "Operation",
                name: "operation",
                type: "options",
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            "extras"
                        ]
                    }
                },
                default: "getExtraById",
                options: [
                    {
                        name: "Get Extra Purchase",
                        value: "getExtraById",
                        action: "Get extra purchase",
                        description: "Retrieve the extra purchase identified by the purchase ID"
                    },
                    {
                        name: "List Extras Purchases",
                        value: "listExtras",
                        action: "List extras purchases",
                        description: "List extras purchases. results are paginated."
                    }
                ]
            },
            {
                displayName: "ID",
                name: "id",
                type: "number",
                default: 0,
                required: true,
                description: "ID of the extra purchase to retrieve",
                displayOptions: {
                    show: {
                        resource: [
                            "extras"
                        ],
                        operation: [
                            "getExtraById"
                        ]
                    }
                }
            },
            {
                displayName: "Additional Fields",
                name: "additionalFields",
                type: "collection",
                placeholder: "Add Field",
                default: {},
                displayOptions: {
                    show: {
                        resource: [
                            "extras"
                        ],
                        operation: [
                            "listExtras"
                        ]
                    }
                },
                options: [
                    {
                        displayName: "Page",
                        name: "page",
                        type: "number",
                        default: 0,
                        description: "Page number of results to retrieve"
                    }
                ]
            },
            {
                displayName: "Output",
                name: "outputMode",
                type: "options",
                default: "simplified",
                description: "Choose whether to return useful fields, the raw response, or selected fields",
                displayOptions: {
                    show: {
                        resource: [
                            "extras"
                        ],
                        operation: [
                            "listExtras"
                        ]
                    }
                },
                options: [
                    {
                        name: "Raw",
                        value: "raw",
                        description: "Return the complete API response"
                    },
                    {
                        name: "Selected Fields",
                        value: "selected",
                        description: "Return only selected fields"
                    },
                    {
                        name: "Simplified",
                        value: "simplified",
                        description: "Return up to 10 useful fields"
                    }
                ]
            },
            {
                displayName: "Fields to Include",
                name: "selectedFields",
                type: "multiOptions",
                default: [
                    "current_page",
                    "first_page_url",
                    "from",
                    "last_page",
                    "last_page_url",
                    "next_page_url",
                    "path",
                    "per_page",
                    "prev_page_url",
                    "to"
                ],
                displayOptions: {
                    show: {
                        resource: [
                            "extras"
                        ],
                        operation: [
                            "listExtras"
                        ],
                        outputMode: [
                            "selected"
                        ]
                    }
                },
                options: [
                    {
                        name: "Current Page",
                        value: "current_page"
                    },
                    {
                        name: "Data",
                        value: "data"
                    },
                    {
                        name: "First Page URL",
                        value: "first_page_url"
                    },
                    {
                        name: "From",
                        value: "from"
                    },
                    {
                        name: "Last Page",
                        value: "last_page"
                    },
                    {
                        name: "Last Page URL",
                        value: "last_page_url"
                    },
                    {
                        name: "Next Page URL",
                        value: "next_page_url"
                    },
                    {
                        name: "Path",
                        value: "path"
                    },
                    {
                        name: "Per Page",
                        value: "per_page"
                    },
                    {
                        name: "Prev Page URL",
                        value: "prev_page_url"
                    },
                    {
                        name: "To",
                        value: "to"
                    },
                    {
                        name: "Total",
                        value: "total"
                    }
                ]
            },
            {
                displayName: "Operation",
                name: "operation",
                type: "options",
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            "members"
                        ]
                    }
                },
                default: "getMemberById",
                options: [
                    {
                        name: "Get",
                        value: "getMemberById",
                        action: "Get member",
                        description: "Retrieve details for the member identified by the path ID"
                    },
                    {
                        name: "List",
                        value: "listMembers",
                        action: "List members",
                        description: "List members with active and inactive subscription statuses. results are paginated. use the status filter to select all, active, or inactive members."
                    }
                ]
            },
            {
                displayName: "ID",
                name: "id",
                type: "number",
                default: 0,
                required: true,
                description: "Unique ID of the member to retrieve",
                displayOptions: {
                    show: {
                        resource: [
                            "members"
                        ],
                        operation: [
                            "getMemberById"
                        ]
                    }
                }
            },
            {
                displayName: "Output",
                name: "outputMode",
                type: "options",
                default: "simplified",
                description: "Choose whether to return useful fields, the raw response, or selected fields",
                displayOptions: {
                    show: {
                        resource: [
                            "members"
                        ],
                        operation: [
                            "getMemberById"
                        ]
                    }
                },
                options: [
                    {
                        name: "Raw",
                        value: "raw",
                        description: "Return the complete API response"
                    },
                    {
                        name: "Selected Fields",
                        value: "selected",
                        description: "Return only selected fields"
                    },
                    {
                        name: "Simplified",
                        value: "simplified",
                        description: "Return up to 10 useful fields"
                    }
                ]
            },
            {
                displayName: "Fields to Include",
                name: "selectedFields",
                type: "multiOptions",
                default: [
                    "country",
                    "message_visibility",
                    "payer_email",
                    "payer_name",
                    "referer",
                    "subscription_cancelled_on",
                    "subscription_coffee_num",
                    "subscription_coffee_price",
                    "subscription_created_on",
                    "subscription_currency"
                ],
                displayOptions: {
                    show: {
                        resource: [
                            "members"
                        ],
                        operation: [
                            "getMemberById"
                        ],
                        outputMode: [
                            "selected"
                        ]
                    }
                },
                options: [
                    {
                        name: "Country",
                        value: "country"
                    },
                    {
                        name: "Message Visibility",
                        value: "message_visibility"
                    },
                    {
                        name: "Payer Email",
                        value: "payer_email"
                    },
                    {
                        name: "Payer Name",
                        value: "payer_name"
                    },
                    {
                        name: "Referer",
                        value: "referer"
                    },
                    {
                        name: "Subscription Cancelled On",
                        value: "subscription_cancelled_on"
                    },
                    {
                        name: "Subscription Coffee Num",
                        value: "subscription_coffee_num"
                    },
                    {
                        name: "Subscription Coffee Price",
                        value: "subscription_coffee_price"
                    },
                    {
                        name: "Subscription Created On",
                        value: "subscription_created_on"
                    },
                    {
                        name: "Subscription Currency",
                        value: "subscription_currency"
                    },
                    {
                        name: "Subscription Current Period End",
                        value: "subscription_current_period_end"
                    },
                    {
                        name: "Subscription Current Period Start",
                        value: "subscription_current_period_start"
                    },
                    {
                        name: "Subscription Duration Type",
                        value: "subscription_duration_type"
                    },
                    {
                        name: "Subscription ID",
                        value: "subscription_id"
                    },
                    {
                        name: "Subscription Is Cancelled",
                        value: "subscription_is_cancelled"
                    },
                    {
                        name: "Subscription Is Cancelled At Period End",
                        value: "subscription_is_cancelled_at_period_end"
                    },
                    {
                        name: "Subscription Message",
                        value: "subscription_message"
                    },
                    {
                        name: "Subscription Updated On",
                        value: "subscription_updated_on"
                    },
                    {
                        name: "Transaction ID",
                        value: "transaction_id"
                    }
                ]
            },
            {
                displayName: "Additional Fields",
                name: "additionalFields",
                type: "collection",
                placeholder: "Add Field",
                default: {},
                displayOptions: {
                    show: {
                        resource: [
                            "members"
                        ],
                        operation: [
                            "listMembers"
                        ]
                    }
                },
                options: [
                    {
                        displayName: "Page",
                        name: "page",
                        type: "number",
                        default: 0,
                        description: "Page number of results to retrieve"
                    },
                    {
                        displayName: "Status",
                        name: "status",
                        type: "options",
                        default: "all",
                        description: "Filter members by subscription status. choose all, active, or inactive.",
                        options: [
                            {
                                name: "Active",
                                value: "active"
                            },
                            {
                                name: "All",
                                value: "all"
                            },
                            {
                                name: "Inactive",
                                value: "inactive"
                            }
                        ]
                    }
                ]
            },
            {
                displayName: "Output",
                name: "outputMode",
                type: "options",
                default: "simplified",
                description: "Choose whether to return useful fields, the raw response, or selected fields",
                displayOptions: {
                    show: {
                        resource: [
                            "members"
                        ],
                        operation: [
                            "listMembers"
                        ]
                    }
                },
                options: [
                    {
                        name: "Raw",
                        value: "raw",
                        description: "Return the complete API response"
                    },
                    {
                        name: "Selected Fields",
                        value: "selected",
                        description: "Return only selected fields"
                    },
                    {
                        name: "Simplified",
                        value: "simplified",
                        description: "Return up to 10 useful fields"
                    }
                ]
            },
            {
                displayName: "Fields to Include",
                name: "selectedFields",
                type: "multiOptions",
                default: [
                    "current_page",
                    "first_page_url",
                    "from",
                    "last_page",
                    "last_page_url",
                    "next_page_url",
                    "path",
                    "per_page",
                    "prev_page_url",
                    "to"
                ],
                displayOptions: {
                    show: {
                        resource: [
                            "members"
                        ],
                        operation: [
                            "listMembers"
                        ],
                        outputMode: [
                            "selected"
                        ]
                    }
                },
                options: [
                    {
                        name: "Current Page",
                        value: "current_page"
                    },
                    {
                        name: "Data",
                        value: "data"
                    },
                    {
                        name: "First Page URL",
                        value: "first_page_url"
                    },
                    {
                        name: "From",
                        value: "from"
                    },
                    {
                        name: "Last Page",
                        value: "last_page"
                    },
                    {
                        name: "Last Page URL",
                        value: "last_page_url"
                    },
                    {
                        name: "Next Page URL",
                        value: "next_page_url"
                    },
                    {
                        name: "Path",
                        value: "path"
                    },
                    {
                        name: "Per Page",
                        value: "per_page"
                    },
                    {
                        name: "Prev Page URL",
                        value: "prev_page_url"
                    },
                    {
                        name: "To",
                        value: "to"
                    },
                    {
                        name: "Total",
                        value: "total"
                    }
                ]
            },
            {
                displayName: "Operation",
                name: "operation",
                type: "options",
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            "supporters"
                        ]
                    }
                },
                default: "getSupporterById",
                options: [
                    {
                        name: "Get",
                        value: "getSupporterById",
                        action: "Get supporter",
                        description: "Retrieve details for the one-time supporter identified by the path ID"
                    },
                    {
                        name: "List",
                        value: "listSupporters",
                        action: "List supporters",
                        description: "List one-time supporters and their messages, when provided. results are paginated."
                    }
                ]
            },
            {
                displayName: "ID",
                name: "id",
                type: "number",
                default: 0,
                required: true,
                description: "Unique ID of the supporter to retrieve",
                displayOptions: {
                    show: {
                        resource: [
                            "supporters"
                        ],
                        operation: [
                            "getSupporterById"
                        ]
                    }
                }
            },
            {
                displayName: "Output",
                name: "outputMode",
                type: "options",
                default: "simplified",
                description: "Choose whether to return useful fields, the raw response, or selected fields",
                displayOptions: {
                    show: {
                        resource: [
                            "supporters"
                        ],
                        operation: [
                            "getSupporterById"
                        ]
                    }
                },
                options: [
                    {
                        name: "Raw",
                        value: "raw",
                        description: "Return the complete API response"
                    },
                    {
                        name: "Selected Fields",
                        value: "selected",
                        description: "Return only selected fields"
                    },
                    {
                        name: "Simplified",
                        value: "simplified",
                        description: "Return up to 10 useful fields"
                    }
                ]
            },
            {
                displayName: "Fields to Include",
                name: "selectedFields",
                type: "multiOptions",
                default: [
                    "country",
                    "is_refunded",
                    "payer_email",
                    "payer_name",
                    "referer",
                    "support_coffee_price",
                    "support_coffees",
                    "support_created_on",
                    "support_currency",
                    "support_email"
                ],
                displayOptions: {
                    show: {
                        resource: [
                            "supporters"
                        ],
                        operation: [
                            "getSupporterById"
                        ],
                        outputMode: [
                            "selected"
                        ]
                    }
                },
                options: [
                    {
                        name: "Country",
                        value: "country"
                    },
                    {
                        name: "Is Refunded",
                        value: "is_refunded"
                    },
                    {
                        name: "Payer Email",
                        value: "payer_email"
                    },
                    {
                        name: "Payer Name",
                        value: "payer_name"
                    },
                    {
                        name: "Referer",
                        value: "referer"
                    },
                    {
                        name: "Support Coffee Price",
                        value: "support_coffee_price"
                    },
                    {
                        name: "Support Coffees",
                        value: "support_coffees"
                    },
                    {
                        name: "Support Created On",
                        value: "support_created_on"
                    },
                    {
                        name: "Support Currency",
                        value: "support_currency"
                    },
                    {
                        name: "Support Email",
                        value: "support_email"
                    },
                    {
                        name: "Support ID",
                        value: "support_id"
                    },
                    {
                        name: "Support Note",
                        value: "support_note"
                    },
                    {
                        name: "Support Updated On",
                        value: "support_updated_on"
                    },
                    {
                        name: "Support Visibility",
                        value: "support_visibility"
                    },
                    {
                        name: "Supporter Name",
                        value: "supporter_name"
                    },
                    {
                        name: "Transaction ID",
                        value: "transaction_id"
                    },
                    {
                        name: "Transfer ID",
                        value: "transfer_id"
                    }
                ]
            },
            {
                displayName: "Additional Fields",
                name: "additionalFields",
                type: "collection",
                placeholder: "Add Field",
                default: {},
                displayOptions: {
                    show: {
                        resource: [
                            "supporters"
                        ],
                        operation: [
                            "listSupporters"
                        ]
                    }
                },
                options: [
                    {
                        displayName: "Page",
                        name: "page",
                        type: "number",
                        default: 0,
                        description: "Page number of results to retrieve"
                    }
                ]
            },
            {
                displayName: "Output",
                name: "outputMode",
                type: "options",
                default: "simplified",
                description: "Choose whether to return useful fields, the raw response, or selected fields",
                displayOptions: {
                    show: {
                        resource: [
                            "supporters"
                        ],
                        operation: [
                            "listSupporters"
                        ]
                    }
                },
                options: [
                    {
                        name: "Raw",
                        value: "raw",
                        description: "Return the complete API response"
                    },
                    {
                        name: "Selected Fields",
                        value: "selected",
                        description: "Return only selected fields"
                    },
                    {
                        name: "Simplified",
                        value: "simplified",
                        description: "Return up to 10 useful fields"
                    }
                ]
            },
            {
                displayName: "Fields to Include",
                name: "selectedFields",
                type: "multiOptions",
                default: [
                    "current_page",
                    "first_page_url",
                    "from",
                    "last_page",
                    "last_page_url",
                    "next_page_url",
                    "path",
                    "per_page",
                    "prev_page_url",
                    "to"
                ],
                displayOptions: {
                    show: {
                        resource: [
                            "supporters"
                        ],
                        operation: [
                            "listSupporters"
                        ],
                        outputMode: [
                            "selected"
                        ]
                    }
                },
                options: [
                    {
                        name: "Current Page",
                        value: "current_page"
                    },
                    {
                        name: "Data",
                        value: "data"
                    },
                    {
                        name: "First Page URL",
                        value: "first_page_url"
                    },
                    {
                        name: "From",
                        value: "from"
                    },
                    {
                        name: "Last Page",
                        value: "last_page"
                    },
                    {
                        name: "Last Page URL",
                        value: "last_page_url"
                    },
                    {
                        name: "Next Page URL",
                        value: "next_page_url"
                    },
                    {
                        name: "Path",
                        value: "path"
                    },
                    {
                        name: "Per Page",
                        value: "per_page"
                    },
                    {
                        name: "Prev Page URL",
                        value: "prev_page_url"
                    },
                    {
                        name: "To",
                        value: "to"
                    },
                    {
                        name: "Total",
                        value: "total"
                    }
                ]
            }
        ]
    };

  public async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const inputItems = this.getInputData();
    const output: INodeExecutionData[] = [];
    for (let itemIndex = 0; itemIndex < inputItems.length; itemIndex += 1) {
      const outputStart = output.length;
      let errorPlan: Record<string, { title: string; recovery?: string; parameter?: string }> = {};
      try {
        const operation = this.getNodeParameter('operation', itemIndex) as string;
        const nodeVersion = this.getNode().typeVersion;
        let additionalFields: IDataObject = {};
        const nodeOptions = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
        
        let retryContract: RetryContract = { mode: 'none', maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0 };
        let credentialApplications: CredentialApplication[] | undefined;
        let options: IHttpRequestOptions;
        let pagination: PaginationContract = { style: 'none', advancement: '', maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10 * 1024 * 1024, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
        let responsePlan: { binary: boolean; full: boolean; envelopePath: string; itemPath: string; fields: string[]; simplified: string[] } = { binary: false, full: false, envelopePath: "", itemPath: "", fields: [], simplified: [] };
        switch (operation) {
          case "getExtraById": {
        
        
        let path = "/extras/{id}";
        const qs: IDataObject = {};
        
        const body: IDataObject | IDataObject[] | string | number | boolean | null = {};
        path = path.split("{id}").join(encodeURIComponent(String(this.getNodeParameter("id", itemIndex))));
        
        
        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
        options = { method: "GET" as unknown as IHttpRequestOptions["method"], url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
        credentialApplications = ([{"credentialType":"buyMeACoffeeApi","type":"bearer"}]) as CredentialApplication[];
        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["extra","payer_email","payer_name","purchase_amount","purchase_currency","purchase_id","purchase_is_revoked","purchase_question","purchase_updated_on","purchased_on"], simplified: ["extra","payer_email","payer_name","purchase_amount","purchase_currency","purchase_id","purchase_is_revoked","purchase_question","purchase_updated_on","purchased_on"] };
        errorPlan = {"400":{"title":"Error"},"401":{"title":"Error"}};
        break;
      }
    case "listExtras": {
        
        additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
        const path = "/extras";
        const qs: IDataObject = {};
        
        const body: IDataObject | IDataObject[] | string | number | boolean | null = {};
        if (additionalFields["page"] !== undefined) qs["page"] = additionalFields["page"];
        
        
        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
        options = { method: "GET" as unknown as IHttpRequestOptions["method"], url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
        credentialApplications = ([{"credentialType":"buyMeACoffeeApi","type":"bearer"}]) as CredentialApplication[];
        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["current_page","data","first_page_url","from","last_page","last_page_url","next_page_url","path","per_page","prev_page_url","to","total"], simplified: ["current_page","first_page_url","from","last_page","last_page_url","next_page_url","path","per_page","prev_page_url","to"] };
        errorPlan = {"400":{"title":"Error"},"401":{"title":"Error"}};
        break;
      }
    case "getMemberById": {
        
        
        let path = "/subscriptions/{id}";
        const qs: IDataObject = {};
        
        const body: IDataObject | IDataObject[] | string | number | boolean | null = {};
        path = path.split("{id}").join(encodeURIComponent(String(this.getNodeParameter("id", itemIndex))));
        
        
        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
        options = { method: "GET" as unknown as IHttpRequestOptions["method"], url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
        credentialApplications = ([{"credentialType":"buyMeACoffeeApi","type":"bearer"}]) as CredentialApplication[];
        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["country","message_visibility","payer_email","payer_name","referer","subscription_cancelled_on","subscription_coffee_num","subscription_coffee_price","subscription_created_on","subscription_currency","subscription_current_period_end","subscription_current_period_start","subscription_duration_type","subscription_id","subscription_is_cancelled","subscription_is_cancelled_at_period_end","subscription_message","subscription_updated_on","transaction_id"], simplified: ["country","message_visibility","payer_email","payer_name","referer","subscription_cancelled_on","subscription_coffee_num","subscription_coffee_price","subscription_created_on","subscription_currency"] };
        errorPlan = {"400":{"title":"Error"},"401":{"title":"Error"}};
        break;
      }
    case "listMembers": {
        
        additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
        const path = "/subscriptions";
        const qs: IDataObject = {};
        
        const body: IDataObject | IDataObject[] | string | number | boolean | null = {};
        if (additionalFields["status"] !== undefined) qs["status"] = additionalFields["status"];
    if (additionalFields["page"] !== undefined) qs["page"] = additionalFields["page"];
        
        
        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
        options = { method: "GET" as unknown as IHttpRequestOptions["method"], url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
        credentialApplications = ([{"credentialType":"buyMeACoffeeApi","type":"bearer"}]) as CredentialApplication[];
        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["current_page","data","first_page_url","from","last_page","last_page_url","next_page_url","path","per_page","prev_page_url","to","total"], simplified: ["current_page","first_page_url","from","last_page","last_page_url","next_page_url","path","per_page","prev_page_url","to"] };
        errorPlan = {"400":{"title":"Error"},"401":{"title":"Error"}};
        break;
      }
    case "getSupporterById": {
        
        
        let path = "/supporters/{id}";
        const qs: IDataObject = {};
        
        const body: IDataObject | IDataObject[] | string | number | boolean | null = {};
        path = path.split("{id}").join(encodeURIComponent(String(this.getNodeParameter("id", itemIndex))));
        
        
        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
        options = { method: "GET" as unknown as IHttpRequestOptions["method"], url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
        credentialApplications = ([{"credentialType":"buyMeACoffeeApi","type":"bearer"}]) as CredentialApplication[];
        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["country","is_refunded","payer_email","payer_name","referer","support_coffee_price","support_coffees","support_created_on","support_currency","support_email","support_id","support_note","support_updated_on","support_visibility","supporter_name","transaction_id","transfer_id"], simplified: ["country","is_refunded","payer_email","payer_name","referer","support_coffee_price","support_coffees","support_created_on","support_currency","support_email"] };
        errorPlan = {"400":{"title":"Error"},"401":{"title":"Error"}};
        break;
      }
    case "listSupporters": {
        
        additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
        const path = "/supporters";
        const qs: IDataObject = {};
        
        const body: IDataObject | IDataObject[] | string | number | boolean | null = {};
        if (additionalFields["page"] !== undefined) qs["page"] = additionalFields["page"];
        
        
        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
        options = { method: "GET" as unknown as IHttpRequestOptions["method"], url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
        credentialApplications = ([{"credentialType":"buyMeACoffeeApi","type":"bearer"}]) as CredentialApplication[];
        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["current_page","data","first_page_url","from","last_page","last_page_url","next_page_url","path","per_page","prev_page_url","to","total"], simplified: ["current_page","first_page_url","from","last_page","last_page_url","next_page_url","path","per_page","prev_page_url","to"] };
        errorPlan = {"400":{"title":"Error"},"401":{"title":"Error"}};
        break;
      }
          default: throw new NodeOperationError(this.getNode(), `Unsupported operation ${operation} for node version ${nodeVersion}`, { itemIndex });
        }
        const returnAll = pagination.style !== 'none' ? Boolean(nodeOptions.returnAll ?? false) : false;
    const resultLimit = pagination.style !== 'none' && !returnAll ? Number(nodeOptions.resultLimit ?? 50) : Math.min(pagination.maxItems, Number.POSITIVE_INFINITY);
    const pageStartTime = Date.now();
    const seenCursors = new Map<string, number>(); const seenPages = new Map<string, number>();
    let page = 1; let offset = 0; let cursor: unknown; let pagesFetched = 0; let estimatedBytes = 0; let finished = false;
    while (!finished && output.length - outputStart < resultLimit && pagesFetched < pagination.maxPages) {
      if (Date.now() - pageStartTime > pagination.maxElapsedMs) throw new NodeOperationError(this.getNode(), 'Pagination elapsed-time budget was exceeded', { itemIndex });
      const qs = options.qs as IDataObject;
      // Only the paginator's own page size is written here. It used to overwrite a
      // limit parameter the operation itself declared and the user had just set.
      if (pagination.limit && (pagesFetched > 0 || qs[pagination.limit] === undefined)) qs[pagination.limit] = Math.min(pagination.pageSize, resultLimit - (output.length - outputStart));
      if (pagination.style === 'offset' && pagination.page) qs[pagination.page] = offset;
      if (pagination.style === 'pageNumber' && pagination.page) qs[pagination.page] = page;
      if (pagination.style === 'cursor' && pagination.cursor && cursor) qs[pagination.cursor] = cursor as string;
      const response = await requestWithRetry(this as never, options, credentialApplications, retryContract, itemIndex);
      pagesFetched += 1;
      const pageFingerprint = JSON.stringify(response);
      const pageRepeats = (seenPages.get(pageFingerprint) ?? 0) + 1;
      seenPages.set(pageFingerprint, pageRepeats);
      if (pageRepeats > pagination.repeatedPageLimit) throw new NodeOperationError(this.getNode(), 'Pagination repeated-page budget was exceeded', { itemIndex });
      estimatedBytes += pageFingerprint.length;
      if (estimatedBytes > pagination.maxMemoryBytes) throw new NodeOperationError(this.getNode(), 'Pagination memory budget was exceeded', { itemIndex });
      if (responsePlan.binary) {
        const binaryPayload = responsePlan.full ? ((response as IDataObject).body ?? response) : response;
        const responseHeaders = (responsePlan.full ? ((response as IDataObject).headers as IDataObject | undefined) : undefined) ?? {};
        const contentType = String(responseHeaders['content-type'] ?? '').split(';')[0].trim() || 'application/octet-stream';
        // prepareBinaryData is what fills in fileName, fileSize and fileExtension.
        // Hand-building the binary entry produced items that downstream nodes could
        // not name or type, and discarded the response's own content type.
        const binaryData = await this.helpers.prepareBinaryData(Buffer.from(binaryPayload as ArrayBuffer), undefined, contentType);
        output.push({ json: {}, binary: { data: binaryData }, pairedItem: { item: itemIndex } });
        finished = true;
        continue;
      }
      const normalizedResponse = responsePlan.full ? ((response as IDataObject).body ?? response) : response;
      const envelopeValue = valueAtPath(normalizedResponse, responsePlan.envelopePath);
      if (responsePlan.envelopePath && envelopeValue === undefined) throw new NodeOperationError(this.getNode(), `Response envelope path "${responsePlan.envelopePath}" was not found`, { itemIndex });
      const envelope = (envelopeValue ?? normalizedResponse) as IDataObject;
      const itemPath = pagination.itemPath || responsePlan.itemPath;
      const extractedItems = valueAtPath(envelope, itemPath);
      if (itemPath && extractedItems === undefined) throw new NodeOperationError(this.getNode(), `Response item path "${itemPath}" was not found`, { itemIndex });
      // A DELETE used to be reported as a fixed { deleted: true } with its body
      // thrown away, which lost the deleted representation and the job handle that
      // asynchronous deletes return. The body is used when there is one.
      const deletedFallback = options.method === 'DELETE' && (normalizedResponse === undefined || normalizedResponse === null || normalizedResponse === '' ||
        (typeof normalizedResponse === 'object' && !Array.isArray(normalizedResponse) && Object.keys(normalizedResponse as IDataObject).length === 0));
      const values = deletedFallback
        ? [{ deleted: true }]
        : Array.isArray(extractedItems) ? extractedItems : Array.isArray(normalizedResponse) ? normalizedResponse : [extractedItems ?? envelope];
      const outputMode = responsePlan.fields.length > 10 ? this.getNodeParameter('outputMode', itemIndex, 'simplified') as string : 'raw';
      const selectedFields = outputMode === 'selected' ? this.getNodeParameter('selectedFields', itemIndex, []) as string[] : [];
      for (const value of values) {
        if (output.length - outputStart >= resultLimit) break;
        const fields = outputMode === 'simplified' ? responsePlan.simplified : outputMode === 'selected' ? selectedFields : [];
        output.push({ json: selectResponseFields(value as IDataObject, fields), pairedItem: { item: itemIndex } });
      }
      if (!returnAll || pagination.style === 'none' || values.length === 0) { finished = true; continue; }
      if (pagination.hasMore && envelope[pagination.hasMore] === false) { finished = true; continue; }
      if (pagination.style === 'cursor') {
        cursor = pagination.responseCursor ? valueAtPath(envelope, pagination.responseCursor) : undefined;
        finished = !cursor;
        if (cursor) {
          const key = String(cursor);
          const repeats = (seenCursors.get(key) ?? 0) + 1;
          seenCursors.set(key, repeats);
          if (repeats > pagination.repeatedCursorLimit) throw new NodeOperationError(this.getNode(), 'Pagination repeated-cursor budget was exceeded', { itemIndex });
        }
      }
      if (pagination.advancement === 'offsetByItems') offset += values.length;
      if (pagination.advancement === 'incrementPage') page += 1;
    }
      } catch (error) {
        if (this.continueOnFail()) {
          output.push({ json: { error: (error as Error).message }, pairedItem: { item: itemIndex } });
          continue;
        }
        if (error instanceof NodeApiError) {
          const status = String((error as unknown as { httpCode?: string; cause?: { statusCode?: number } }).httpCode ?? (error as unknown as { cause?: { statusCode?: number } }).cause?.statusCode ?? 'default');
          const planned = errorPlan[status] ?? errorPlan.default;
          if (planned) {
            const parameterHelp = planned.parameter ? `Check the '${planned.parameter}' parameter.` : undefined;
            const description = [planned.recovery, parameterHelp].filter(Boolean).join(' ');
            throw new NodeApiError(this.getNode(), error as unknown as JsonObject, { itemIndex, message: planned.title, description });
          }
        }
        if (error instanceof NodeApiError) throw new NodeApiError(this.getNode(), error as unknown as JsonObject, { itemIndex });
        throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
      }
    }
    return [output];
  }
}
