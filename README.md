# Custom Form Builder (MERN Stack)



A responsive web application for creating, previewing, and filling forms with three unique question types. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Bootstrap.

## ✨ Features

### Form Creation
- Intuitive form editor with live preview
- Three specialized question types:
  - **Categorize**: Drag-and-drop items into categories
  - **Cloze**: Interactive fill-in-the-blank exercises
  - **Comprehension**: Reading passages with multiple-choice questions
- Rich media support (images for headers and questions)
- Form validation and error handling

### User Experience
- Question navigation sidebar
- Submission confirmation screen
- Form listing and management

## 🛠 Tech Stack

**Frontend**  
- React.js (Functional Components with Hooks)
- React Router for navigation
- Bootstrap 5 for responsive UI
- react-beautiful-dnd for drag-and-drop
- Axios for API calls

**Backend**  
- Node.js with Express.js
- MongoDB Atlas (Cloud Database)
- Mongoose ODM

**Deployment**  
- on Render


## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm (v8+ recommended)
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   
   git clone [https://github.com/yourusername/custom-form-builder](https://github.com/Jash-1th/FormBuilder).git
   cd custom-form-builder
2. **Set up backend**
   cd backend
   npm install
   set in .env  # Update with your MongoDB credentials
3. **Set up frontend**
   cd ../frontend
   npm  install
# Running Locally
1. **Start backend server**
   npm start
``` bash
Server runs on http://localhost:5000
```
2. **Start frontend**
  npm start
``` bash
App opens at http://localhost:3000
```
# Live Demo
Experience the deployed application: https://formbuilder-2-6e62.onrender.com
