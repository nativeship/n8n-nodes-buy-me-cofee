"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyMeACoffee = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const http_1 = require("../../shared/http");
function selectResponseFields(value, fields) {
    if (fields.length === 0)
        return value;
    const selected = {};
    if (value.id !== undefined)
        selected.id = value.id;
    for (const field of fields)
        if (value[field] !== undefined)
            selected[field] = value[field];
    return selected;
}
function valueAtPath(value, path) {
    if (!path)
        return value;
    return path.split('.').filter(Boolean).reduce((current, segment) => {
        if (current === undefined || current === null)
            return undefined;
        if (Array.isArray(current))
            return current[Number(segment)];
        return current[segment];
    }, value);
}
class BuyMeACoffee {
    constructor() {
        this.description = {
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
                n8n_workflow_1.NodeConnectionTypes.Main
            ],
            outputs: [
                n8n_workflow_1.NodeConnectionTypes.Main
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
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const inputItems = this.getInputData();
        const output = [];
        for (let itemIndex = 0; itemIndex < inputItems.length; itemIndex += 1) {
            const outputStart = output.length;
            let errorPlan = {};
            try {
                const operation = this.getNodeParameter('operation', itemIndex);
                const nodeVersion = this.getNode().typeVersion;
                let additionalFields = {};
                const nodeOptions = this.getNodeParameter('options', itemIndex, {});
                let retryContract = { mode: 'none', maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0 };
                let credentialApplications;
                let options;
                let pagination = { style: 'none', advancement: '', maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10 * 1024 * 1024, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
                let responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: [], simplified: [] };
                switch (operation) {
                    case "getExtraById": {
                        let path = "/extras/{id}";
                        const qs = {};
                        const body = {};
                        path = path.split("{id}").join(encodeURIComponent(String(this.getNodeParameter("id", itemIndex))));
                        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
                        options = { method: "GET", url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
                        credentialApplications = ([{ "credentialType": "buyMeACoffeeApi", "type": "bearer" }]);
                        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
                        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
                        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["extra", "payer_email", "payer_name", "purchase_amount", "purchase_currency", "purchase_id", "purchase_is_revoked", "purchase_question", "purchase_updated_on", "purchased_on"], simplified: ["extra", "payer_email", "payer_name", "purchase_amount", "purchase_currency", "purchase_id", "purchase_is_revoked", "purchase_question", "purchase_updated_on", "purchased_on"] };
                        errorPlan = { "400": { "title": "Error" }, "401": { "title": "Error" } };
                        break;
                    }
                    case "listExtras": {
                        additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});
                        const path = "/extras";
                        const qs = {};
                        const body = {};
                        if (additionalFields["page"] !== undefined)
                            qs["page"] = additionalFields["page"];
                        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
                        options = { method: "GET", url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
                        credentialApplications = ([{ "credentialType": "buyMeACoffeeApi", "type": "bearer" }]);
                        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
                        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
                        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["current_page", "data", "first_page_url", "from", "last_page", "last_page_url", "next_page_url", "path", "per_page", "prev_page_url", "to", "total"], simplified: ["current_page", "first_page_url", "from", "last_page", "last_page_url", "next_page_url", "path", "per_page", "prev_page_url", "to"] };
                        errorPlan = { "400": { "title": "Error" }, "401": { "title": "Error" } };
                        break;
                    }
                    case "getMemberById": {
                        let path = "/subscriptions/{id}";
                        const qs = {};
                        const body = {};
                        path = path.split("{id}").join(encodeURIComponent(String(this.getNodeParameter("id", itemIndex))));
                        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
                        options = { method: "GET", url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
                        credentialApplications = ([{ "credentialType": "buyMeACoffeeApi", "type": "bearer" }]);
                        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
                        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
                        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["country", "message_visibility", "payer_email", "payer_name", "referer", "subscription_cancelled_on", "subscription_coffee_num", "subscription_coffee_price", "subscription_created_on", "subscription_currency", "subscription_current_period_end", "subscription_current_period_start", "subscription_duration_type", "subscription_id", "subscription_is_cancelled", "subscription_is_cancelled_at_period_end", "subscription_message", "subscription_updated_on", "transaction_id"], simplified: ["country", "message_visibility", "payer_email", "payer_name", "referer", "subscription_cancelled_on", "subscription_coffee_num", "subscription_coffee_price", "subscription_created_on", "subscription_currency"] };
                        errorPlan = { "400": { "title": "Error" }, "401": { "title": "Error" } };
                        break;
                    }
                    case "listMembers": {
                        additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});
                        const path = "/subscriptions";
                        const qs = {};
                        const body = {};
                        if (additionalFields["status"] !== undefined)
                            qs["status"] = additionalFields["status"];
                        if (additionalFields["page"] !== undefined)
                            qs["page"] = additionalFields["page"];
                        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
                        options = { method: "GET", url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
                        credentialApplications = ([{ "credentialType": "buyMeACoffeeApi", "type": "bearer" }]);
                        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
                        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
                        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["current_page", "data", "first_page_url", "from", "last_page", "last_page_url", "next_page_url", "path", "per_page", "prev_page_url", "to", "total"], simplified: ["current_page", "first_page_url", "from", "last_page", "last_page_url", "next_page_url", "path", "per_page", "prev_page_url", "to"] };
                        errorPlan = { "400": { "title": "Error" }, "401": { "title": "Error" } };
                        break;
                    }
                    case "getSupporterById": {
                        let path = "/supporters/{id}";
                        const qs = {};
                        const body = {};
                        path = path.split("{id}").join(encodeURIComponent(String(this.getNodeParameter("id", itemIndex))));
                        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
                        options = { method: "GET", url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
                        credentialApplications = ([{ "credentialType": "buyMeACoffeeApi", "type": "bearer" }]);
                        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
                        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
                        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["country", "is_refunded", "payer_email", "payer_name", "referer", "support_coffee_price", "support_coffees", "support_created_on", "support_currency", "support_email", "support_id", "support_note", "support_updated_on", "support_visibility", "supporter_name", "transaction_id", "transfer_id"], simplified: ["country", "is_refunded", "payer_email", "payer_name", "referer", "support_coffee_price", "support_coffees", "support_created_on", "support_currency", "support_email"] };
                        errorPlan = { "400": { "title": "Error" }, "401": { "title": "Error" } };
                        break;
                    }
                    case "listSupporters": {
                        additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});
                        const path = "/supporters";
                        const qs = {};
                        const body = {};
                        if (additionalFields["page"] !== undefined)
                            qs["page"] = additionalFields["page"];
                        const serverBaseUrl = { url: "https://developers.buymeacoffee.com/api/v1", blockRedirects: false };
                        options = { method: "GET", url: serverBaseUrl.url + path, qs, body: body, json: true, arrayFormat: "indices", ...(serverBaseUrl.blockRedirects ? { maxRedirects: 0 } : {}) };
                        credentialApplications = ([{ "credentialType": "buyMeACoffeeApi", "type": "bearer" }]);
                        retryContract = { mode: "none", retryConnectionFailures: false, retryTimeouts: false, retryRateLimits: false, retryServerErrors: false, maxAttempts: 1, maxElapsedMs: 30000, baseBackoffMs: 500, maxBackoffMs: 5000, jitterRatio: 0.2, idempotency: undefined };
                        pagination = { style: "none", page: "", limit: "", cursor: "", responseCursor: "", hasMore: "", itemPath: "", advancement: "", maxPages: 1, maxItems: Number.POSITIVE_INFINITY, maxElapsedMs: 30000, maxMemoryBytes: 10485760, repeatedCursorLimit: 1, repeatedPageLimit: 1, pageSize: 100 };
                        responsePlan = { binary: false, full: false, envelopePath: "", itemPath: "", fields: ["current_page", "data", "first_page_url", "from", "last_page", "last_page_url", "next_page_url", "path", "per_page", "prev_page_url", "to", "total"], simplified: ["current_page", "first_page_url", "from", "last_page", "last_page_url", "next_page_url", "path", "per_page", "prev_page_url", "to"] };
                        errorPlan = { "400": { "title": "Error" }, "401": { "title": "Error" } };
                        break;
                    }
                    default: throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported operation ${operation} for node version ${nodeVersion}`, { itemIndex });
                }
                const returnAll = pagination.style !== 'none' ? Boolean((_a = nodeOptions.returnAll) !== null && _a !== void 0 ? _a : false) : false;
                const resultLimit = pagination.style !== 'none' && !returnAll ? Number((_b = nodeOptions.resultLimit) !== null && _b !== void 0 ? _b : 50) : Math.min(pagination.maxItems, Number.POSITIVE_INFINITY);
                const pageStartTime = Date.now();
                const seenCursors = new Map();
                const seenPages = new Map();
                let page = 1;
                let offset = 0;
                let cursor;
                let pagesFetched = 0;
                let estimatedBytes = 0;
                let finished = false;
                while (!finished && output.length - outputStart < resultLimit && pagesFetched < pagination.maxPages) {
                    if (Date.now() - pageStartTime > pagination.maxElapsedMs)
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Pagination elapsed-time budget was exceeded', { itemIndex });
                    const qs = options.qs;
                    if (pagination.limit && (pagesFetched > 0 || qs[pagination.limit] === undefined))
                        qs[pagination.limit] = Math.min(pagination.pageSize, resultLimit - (output.length - outputStart));
                    if (pagination.style === 'offset' && pagination.page)
                        qs[pagination.page] = offset;
                    if (pagination.style === 'pageNumber' && pagination.page)
                        qs[pagination.page] = page;
                    if (pagination.style === 'cursor' && pagination.cursor && cursor)
                        qs[pagination.cursor] = cursor;
                    const response = await (0, http_1.requestWithRetry)(this, options, credentialApplications, retryContract, itemIndex);
                    pagesFetched += 1;
                    const pageFingerprint = JSON.stringify(response);
                    const pageRepeats = ((_c = seenPages.get(pageFingerprint)) !== null && _c !== void 0 ? _c : 0) + 1;
                    seenPages.set(pageFingerprint, pageRepeats);
                    if (pageRepeats > pagination.repeatedPageLimit)
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Pagination repeated-page budget was exceeded', { itemIndex });
                    estimatedBytes += pageFingerprint.length;
                    if (estimatedBytes > pagination.maxMemoryBytes)
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Pagination memory budget was exceeded', { itemIndex });
                    if (responsePlan.binary) {
                        const binaryPayload = responsePlan.full ? ((_d = response.body) !== null && _d !== void 0 ? _d : response) : response;
                        const responseHeaders = (_e = (responsePlan.full ? response.headers : undefined)) !== null && _e !== void 0 ? _e : {};
                        const contentType = String((_f = responseHeaders['content-type']) !== null && _f !== void 0 ? _f : '').split(';')[0].trim() || 'application/octet-stream';
                        const binaryData = await this.helpers.prepareBinaryData(Buffer.from(binaryPayload), undefined, contentType);
                        output.push({ json: {}, binary: { data: binaryData }, pairedItem: { item: itemIndex } });
                        finished = true;
                        continue;
                    }
                    const normalizedResponse = responsePlan.full ? ((_g = response.body) !== null && _g !== void 0 ? _g : response) : response;
                    const envelopeValue = valueAtPath(normalizedResponse, responsePlan.envelopePath);
                    if (responsePlan.envelopePath && envelopeValue === undefined)
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Response envelope path "${responsePlan.envelopePath}" was not found`, { itemIndex });
                    const envelope = (envelopeValue !== null && envelopeValue !== void 0 ? envelopeValue : normalizedResponse);
                    const itemPath = pagination.itemPath || responsePlan.itemPath;
                    const extractedItems = valueAtPath(envelope, itemPath);
                    if (itemPath && extractedItems === undefined)
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Response item path "${itemPath}" was not found`, { itemIndex });
                    const deletedFallback = options.method === 'DELETE' && (normalizedResponse === undefined || normalizedResponse === null || normalizedResponse === '' ||
                        (typeof normalizedResponse === 'object' && !Array.isArray(normalizedResponse) && Object.keys(normalizedResponse).length === 0));
                    const values = deletedFallback
                        ? [{ deleted: true }]
                        : Array.isArray(extractedItems) ? extractedItems : Array.isArray(normalizedResponse) ? normalizedResponse : [extractedItems !== null && extractedItems !== void 0 ? extractedItems : envelope];
                    const outputMode = responsePlan.fields.length > 10 ? this.getNodeParameter('outputMode', itemIndex, 'simplified') : 'raw';
                    const selectedFields = outputMode === 'selected' ? this.getNodeParameter('selectedFields', itemIndex, []) : [];
                    for (const value of values) {
                        if (output.length - outputStart >= resultLimit)
                            break;
                        const fields = outputMode === 'simplified' ? responsePlan.simplified : outputMode === 'selected' ? selectedFields : [];
                        output.push({ json: selectResponseFields(value, fields), pairedItem: { item: itemIndex } });
                    }
                    if (!returnAll || pagination.style === 'none' || values.length === 0) {
                        finished = true;
                        continue;
                    }
                    if (pagination.hasMore && envelope[pagination.hasMore] === false) {
                        finished = true;
                        continue;
                    }
                    if (pagination.style === 'cursor') {
                        cursor = pagination.responseCursor ? valueAtPath(envelope, pagination.responseCursor) : undefined;
                        finished = !cursor;
                        if (cursor) {
                            const key = String(cursor);
                            const repeats = ((_h = seenCursors.get(key)) !== null && _h !== void 0 ? _h : 0) + 1;
                            seenCursors.set(key, repeats);
                            if (repeats > pagination.repeatedCursorLimit)
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Pagination repeated-cursor budget was exceeded', { itemIndex });
                        }
                    }
                    if (pagination.advancement === 'offsetByItems')
                        offset += values.length;
                    if (pagination.advancement === 'incrementPage')
                        page += 1;
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    output.push({ json: { error: error.message }, pairedItem: { item: itemIndex } });
                    continue;
                }
                if (error instanceof n8n_workflow_1.NodeApiError) {
                    const status = String((_l = (_j = error.httpCode) !== null && _j !== void 0 ? _j : (_k = error.cause) === null || _k === void 0 ? void 0 : _k.statusCode) !== null && _l !== void 0 ? _l : 'default');
                    const planned = (_m = errorPlan[status]) !== null && _m !== void 0 ? _m : errorPlan.default;
                    if (planned) {
                        const parameterHelp = planned.parameter ? `Check the '${planned.parameter}' parameter.` : undefined;
                        const description = [planned.recovery, parameterHelp].filter(Boolean).join(' ');
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { itemIndex, message: planned.title, description });
                    }
                }
                if (error instanceof n8n_workflow_1.NodeApiError)
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { itemIndex });
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex });
            }
        }
        return [output];
    }
}
exports.BuyMeACoffee = BuyMeACoffee;
//# sourceMappingURL=BuyMeACoffee.node.js.map