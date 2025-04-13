# Deutch Score Light

A lightweight Angular application for tracking and managing scores in the popular card game, Deutch.

## Table of Contents

1.  [Description](#description)
2.  [Features](#features)
3.  [Technologies Used](#technologies-used)
4.  [Setup and Installation](#setup-and-installation)
5.  [Running the Application](#running-the-application)
6.  [Project Structure](#project-structure)
7.  [Components](#components)
8.  [Services](#services)
9.  [Environment Configuration](#environment-configuration)
10. [Testing](#testing)
11. [Contributing](#contributing)
12. [License](#license)
13. [Contact](#contact)

## Description

Deutch Score Light is a simple and intuitive Angular application designed to help you keep track of scores while playing Deutch (a card game).  It allows you to add players, record scores for each round, compute total scores, and optionally save the data to a Supabase database. The application provides a clean user interface with a sidebar for navigation and a modal for confirming save actions.

## Features

*   **Player Management:** Add and remove players easily.
*   **Score Tracking:** Input scores for each player in each round.
*   **Automatic Calculation:**  Automatically computes and displays the total score for each player.
*   **Visual Indicators:**  Highlights the player with the minimum and maximum score.
*   **Data Persistence (Optional):** Save scores to a Supabase database.
*   **Responsive Design:** Works well on various screen sizes.
*   **Navigation:** Sidebar menu for navigating between scores and stats pages.
*   **Stats Page:** Display game statistics.

## Technologies Used

*   **Angular** v19
*   **TypeScript** 
*   **SCSS**
*   **Supabase** 
*   **RxJS**

## Setup and Installation

1.  **Prerequisites:**

    *   [Node.js](https://nodejs.org/) (v16 or higher recommended)
    *   [npm](https://www.npmjs.com/) (Node Package Manager) or [Yarn](https://yarnpkg.com/)

2.  **Clone the repository:**

    ```bash
    git clone https://github.com/E-Mohamed/dutch-score-light.git
    cd deutch-score-light
    ```

3.  **Install dependencies:**

    ```bash
    npm install  # or yarn install
    ```

4.  **Configure Environment Variables:**

    *   Create a `environment.local.ts` file in the root of the project (if you don't already have one).
    *   Add your Supabase URL and Key to the `environment.local.ts` file.  These are read by the `environment.ts` file.

    ```
    SUPABASE_URL=<your_supabase_url>
    SUPABASE_KEY=<your_supabase_key>
    POOL_ID=<your_pool_id>
    ```

    *   Update `src/environments/environment.ts` and `src/environments/environment.development.ts` with your Supabase credentials and `poolId`.

    ```typescript
    // environment.ts
    export const environment = {
      production: false,
      supabaseUrl: '<your_supabase_url>',
      supabaseKey: '<your_supabase_key>',
      poolId: <your_pool_id>,
    };
    ```

## Running the Application

1.  **Start the development server:**

    ```bash
    npm start  # or ng serve
    ```

2.  **Open your browser and navigate to `http://localhost:4200/`**.

## Components

*   **`AppComponent`:** The root component that manages the overall layout, including the header, sidebar, and main content area.

*   **`SidebarComponent`:**  The sidebar component provides navigation links to different sections of the application (Scores, Stats).

*   **`ModalComponent`:** A reusable modal component for displaying confirmation messages.

## Services

*   **`SupabaseService`:**  Handles communication with the Supabase database.

*   **`StateService`:** Manages application-wide state, such as the list of game pools.

## Environment Configuration

The application uses environment variables to configure settings like the Supabase URL and API key. These variables are defined in the `src/environments/environment.ts` and `src/environments/environment.development.ts` files.  Make sure to update these files with your specific Supabase credentials.

## Testing

The project includes unit tests written with Jasmine and Karma.

*   **To run the tests:**

    ```bash
    npm test # or ng test
    ```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

TBD

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or suggestions, feel free to contact me at [ismael.eljarrari@gmail.com](mailto:ismael.eljarrari@gmail.com).
