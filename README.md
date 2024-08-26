# Jobify Dashboard

## Overview
Jobify Dashboard is a full-stack job management application that allows users to manage job listings, track job statistics, and update their profiles. The project includes features such as user authentication, job filtering, and dynamic data visualization.

## Features

### 1. User Management
- **Register and Login:** Secure user authentication with registration and login pages.
- **Tester User:** A demo user account for testing and exploring the dashboard.

### 2. Job Statistics
- **Status Page:** Displays job-related statistics including:
  - Pending applications
  - Scheduled interviews
  - Declined jobs
  - Monthly job numbers with interactive charts.

### 3. Job Listings Management
- **All Jobs Page:** 
  - Displays job listings with pagination (10 jobs per page).
  - Search functionality to find specific jobs.
  - Filters for job status (interviewed, declined, pending) and job type (full-time, part-time, remote, internship).
  - Sorting options (latest, oldest, A-Z, Z-A).
  - Edit and delete job options.

### 4. Job Creation
- **Add Job Page:** 
  - Create new job listings with options to set job status (interviewed, declined, pending) and job type (full-time, part-time, remote, internship).

### 5. Profile Management
- **Profile Page:** 
  - Users can update their personal information, including name, email, last name, and location.

## Technologies Used
- **Frontend:** React, Context API, useReducer, Axios, HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express, MongoDB
- **Additional Tools:** Responsive Design, Charts

## Project Structure


## Setup Instructions

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/jobify-dashboard.git

install dependency for server
npm install

Set up environment variables:
Create a .env file in the server directory with your environment variables (e.g., database connection, JWT secret).

Start the server:
npm start

to install dependency for client
cd client
npm install

Start the server and client open cmd in folder which have client and all structure folder for server
npm start