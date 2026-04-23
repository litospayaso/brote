# Brote

<!-- BADGES_START -->
![version](https://img.shields.io/badge/version-1.0.48-blue) ![test core](https://img.shields.io/badge/test_core-failing-red) ![coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)
<!-- BADGES_END -->

<p align="center">
  <img src="./android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png" alt="Brote icon"/>
</p>

Brote is a modern, privacy-focused calorie and macronutrient tracking application built with Web Components and Lit. It allows users to track their daily food intake, manage personal meals, and monitor their progress against nutritional goals.

## Download

<div style="display: flex; flex-direction: row; gap: 10px; align-items: center; justify-content: center;">
  <a href="https://github-store.org/app?repo=litospayaso/brote" rel="nofollow">
    <img src="/assets/ghs_download_badge.png" alt="Get it on GitHub Store" height="64" style="max-width: 100%; height: auto; max-height: 64px;">
  </a>

  <a href="https://github.com/litospayaso/brote/releases">
    <img src="/assets/getit-gb-badge.png" alt="Get it on GitHub Store" height="70" style="max-width: 100%; height: auto; max-height: 70px;">
  </a>

  <a href="https://play.google.com/store/apps/details?id=angelitapp.brote">
    <img src="/assets/getit-gp-badge.png" alt="Get it on Google Play" height="70" style="max-width: 100%; height: auto; max-height: 70px;">
  </a>
</div>


## Screenshoots

<div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: center;">
   <img src="/assets/screenshots/image1.jpeg" alt="image 1" height="100" style="max-width: 100%; height: auto; max-height: 100px;">
   <img src="/assets/screenshots/image2.jpeg" alt="image 2" height="100" style="max-width: 100%; height: auto; max-height: 100px;">
   <img src="/assets/screenshots/image3.jpeg" alt="image 3" height="100" style="max-width: 100%; height: auto; max-height: 100px;">
   <img src="/assets/screenshots/image4.jpeg" alt="image 4" height="100" style="max-width: 100%; height: auto; max-height: 100px;">
   <img src="/assets/screenshots/image5.jpeg" alt="image 5" height="100" style="max-width: 100%; height: auto; max-height: 100px;">
</div>

## Core Technology Stack

- **[Lit](https://lit.dev/)**: Lightweight base class for creating fast, lightweight Web Components.
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling for a fast development experience.
- **[Esbuild](https://esbuild.github.io/)**: An extremely fast JavaScript bundler used for component distribution.
- **[Web Test Runner](https://modern-web.dev/docs/test-runner/overview/)**: Modern testing environment for web components.
- **[Storybook](https://storybook.js.org/)**: Development environment for UI components.
- **IndexedDB**: Local client-side storage for offline capability and data privacy.

## Project Structure

The project follows a workspace-based architecture:

- `src/components/`: Contains all UI components and pages.
  - `component*`: Reusable UI elements (e.g., Progress Bar, Charts, Search Input).
  - `page*`: Top-level application pages (e.g., Home, Search, Food details, User profile).
- `src/shared/`: Core services and base classes shared across the application.
  - `db.ts`: `DBService` for IndexedDB management.
  - `page.ts`: `Page` base class for common page functionality.
  - `translations.ts`: Multilingual support.
- `scripts/`: Utility scripts for deployment and commit hooks.

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Run Storybook to develop components in isolation:

```bash
npm run storybook
```

### Building

Build the components for distribution using esbuild:

```bash
npm run build
```

### Deployment / Distribution

The latest web version will be updated at `./gh-pages/` and can be deployed using gh-pages using the command:

```bash
npm run deploy:pages
```

## Mobile App (Android)

Brote can be built as an Android application using Capacitor.js.

### Build Instructions

1.  **Generate Web Assets**: Ensure the latest web version is built in the `gh-pages` directory:
    ```bash
    npm run build
    ```
2.  **Sync with Capacitor**: Sync the web assets to the Android platform:
    ```bash
    npm run cap:sync
    ```
3.  **Open in Android Studio**: Open the Android project to build the APK:
    ```bash
    npm run cap:open:android
    ```

Note: You need Android Studio installed and configured on your system.

## Testing

The project uses Web Test Runner for unit and integration testing.

Run all tests:

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
```

Coverage reports are generated in the `coverage/` directory after running tests with `--coverage`.

## Application Logic

### Base Page Class (`src/shared/page.ts`)

Every page in the application extends the `Page` base class. This provides:

- **Navigation**: Methods for internal and external navigation.
- **Theming**: Integrated support for light and dark modes.
- **Localization**: Automatic language detection and management.
- **Database Access**: Direct access to the `DBService` instance.

### Data Management (`src/shared/db.ts`)

Data is persisted locally using IndexedDB through the `DBService`. Key data stores include:

- `daily_consumption`: Stores daily food logs.
- `products`: Cache for food products retrieved from external APIs.
- `meals`: Custom user-defined meals.
- `favorites`: User-bookmarked food items.
- `weight_history`: Historical weight entries.

### Component-Based Pages

Pages are built by composing reusable components. For example, `PageHome` uses `component-progress-bar` to show nutritional goals and `component-search-result` to display logged items.

## Deployment

The application is configured for deployment to GitHub Pages via:

```bash
npm run deploy:pages
```

## Releases

You can find the release notes in the `releases/` directory.

## Third Party Libraries

The project uses a connection to Open Food Facts API to get food data.
It also uses the library html5-qrcode to scan barcodes.

## License

The project is fully open source and can be used by anyone.
