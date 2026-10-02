# Buy Me a Coffee n8n community node

Helps creators receive support, offer memberships, and sell products.

Generated from OpenAPI 1.0.0 with template 1.1.0. Generated files are platform-managed and will be overwritten during regeneration.

## Authentication

Configure the generated bearer token credential in n8n before using the node.

## Supported operations

- `GET /extras/{id}` - Get extra purchase
  - Retry Contract: none
  - Pagination Contract: none
- `GET /extras` - List extras purchases
  - Retry Contract: none
  - Pagination Contract: none
- `GET /subscriptions/{id}` - Get member
  - Retry Contract: none
  - Pagination Contract: none
- `GET /subscriptions` - List members
  - Retry Contract: none
  - Pagination Contract: none
- `GET /supporters/{id}` - Get supporter
  - Retry Contract: none
  - Pagination Contract: none
- `GET /supporters` - List supporters
  - Retry Contract: none
  - Pagination Contract: none

## Usage

1. Install this community-node package in n8n.
2. Add the **Buy Me a Coffee** node to a workflow.
3. Select a resource and operation, configure its parameters, and execute the workflow.

## Example workflow

Connect **Manual Trigger** -> **Buy Me a Coffee** -> a destination node, select an operation, then run the workflow and inspect the returned items.

## Development

```sh
npm install
npm run build
npm run lint
npm run dev
```

`npm run dev` starts a local n8n development instance. Find the integration by its **Buy Me a Coffee** display name.
