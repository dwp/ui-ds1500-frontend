# ui-ds1500-frontend

Node.js frontend.

## Contents

* Documents
* Application Architecture
* Build the Node Server
* Running the Node Server
* Testing
* Checks

## Documents

https://confluence.service.dwpcloud.uk/pages/viewpage.action?pageId=173911803

## Application Architecture

node.js application using the @dwp/govuk-casa internally-created node module used for inputting form data.
Uses css, html, node, and nunjucks.

### Application files

Follows the standard structure for CASA integration.

See documentation of @dwp/govuk-casa.

## Build the Node Server

`npm install`


## Running the Node Server

Run the mock API Server `npm run start-mock-service`
Run the Node Server `npm run start:dev`

Stop the mock API Server `npm run stop-mock-service`


## Testing

* Must execute the 'Running the Node Server' section before running tests

Run all tests `npm run test`

### Unit tests
Run all unit tests `npm run test:unit`

### Component tests
Run all component tests with Node Service and Mock API `npm run test:standalone`

## Checks

### Linting

`npm run quality:lint`

### Audit

`npm run security:vulnerable-packages`

### SonarQube

`npm run quality:sonarqube`
