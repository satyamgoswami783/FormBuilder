# Custom Form Builder (MERN Stack, Bootstrap)

## Overview

The Custom Form Builder is a web application that allows users to create, edit, preview, and fill out forms with three unique question types: Categorize, Cloze, and Comprehension. The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and features a responsive UI inspired by Typeform and Paperform.

## Features

- Create and edit forms with a user-friendly interface.
- Support for three question types: 
  - **Categorize**: Users can categorize items.
  - **Cloze**: Fill in the blanks in a given text.
  - **Comprehension**: Answer questions based on a provided passage.
- Add a header image to the form and images to individual questions.
- Save forms and responses to MongoDB Atlas.
- Preview and fill forms via unique links.

## Tech Stack

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Image Upload**: Base64 (for beginners; cloud upload can be added later)

## Folder Structure

```
custom-form-builder/
  backend/
    controllers/
    models/
    routes/
    .env
    server.js
    package.json
  frontend/
    public/
    src/
      components/
      App.js
      api.js
      index.js
    package.json
  README.md
```

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB Atlas account for database hosting.

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd custom-form-builder
   ```

2. Set up the backend:
   - Navigate to the backend directory:
     ```
     cd backend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Create a `.env` file and add your MongoDB connection string:
     ```
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/formbuilder
     PORT=5000
     ```

3. Start the backend server:
   ```
   node server.js
   ```

4. Set up the frontend:
   - Navigate to the frontend directory:
     ```
     cd ../frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Start the frontend application:
     ```
     npm start
     ```

### Running the Application

- The backend will run at `http://localhost:5000`.
- The frontend will run at `http://localhost:3000`.

## Deployment

### Backend

- Push the backend code to a GitHub repository.
- Use a platform like Render to deploy the backend:
  - Create a new Web Service and connect your repository.
  - Set environment variables (MONGO_URI, PORT).
  - Deploy.

### Frontend

- In `frontend/package.json`, set the homepage:
  ```
  "homepage": "https://<your-frontend-domain>"
  ```
- In `frontend/.env`, set the API URL:
  ```
  REACT_APP_API_URL=https://<your-backend-domain>/api
  ```
- Push the frontend code to a GitHub repository.
- Deploy on platforms like Netlify or Vercel.

## Dependencies

### Backend

- express
- mongoose
- cors
- dotenv

### Frontend

- react
- react-dom
- react-router-dom
- axios
- bootstrap

## Reference

For a demonstration of the application, please refer to the following video: [Assignment demo](https://www.loom.com/share/17c1ea4e9b4d4829b453c5e9eae8aedf?sid=1c2ee81f-b194-4bc6-a058-ec3c47c4707a).

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features you would like to add!