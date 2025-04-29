# Job Board Frontend

This is the frontend for the Job Board application, built with React.

## Features

- User registration and authentication
- Job listings with search and filtering capabilities
- Job application system
- Dashboard for both job seekers and employers
- Post and manage job listings (for employers)
- Track job applications (for job seekers)

## Technologies Used

- React
- React Router
- Axios for API requests
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
   ```
   cd frontend
   ```
3. Install dependencies
   ```
   npm install
   ```
4. Start the development server
   ```
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Project Structure

- `src/`: Contains all the source code
  - `components/`: Reusable UI components
  - `pages/`: Full page components
  - `services/`: API service functions
  - `context/`: React context providers

## API Integration

This frontend is designed to work with the backend API. Make sure the backend server is running at `http://localhost:5000` or update the base URL in `src/App.js` to point to your API server.

## Learn More

For more information on React, check out the [React documentation](https://reactjs.org/).
