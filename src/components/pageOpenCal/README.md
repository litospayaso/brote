# Brote App

The orchestrator page for the Brote application.

## Description
This component acts as the main router/controller for the application. It inspects the URL path and renders the appropriate sub-page:
- `/product/:code`: Renders `PageFood` with the specified product code.
- `/`: Renders `PageSearch`.

## Usage
This component should be used as the main entry point in the application's `index.html`.

```html
<brote-app></brote-app>
```
