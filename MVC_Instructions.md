# Recipe Sharing Web Application (MVC Version)

A web application for sharing recipes. Users can sign up, log in, create recipes, and favorite recipes. This version has been refactored into a **Model-View-Controller (MVC)** architecture for improved maintainability and scalability.

---

## Setup Instructions

### 1. Clone the Repository
git clone https://github.com/alexaaguilar10/RecipeSharingSystem.git

cd RecipeSharingSystem

### 2. Checkout the MVC Branch
git checkout mvc-architecture


### 3. Install Dependencies
npm install


### 4. Set Up MySQL Database
Open MySQL: mysql -u root -p

Run the schema file to create the database and tables: mysql -u root -p < Database/schema.sql


Update database credentials in `Backend/config/db.js` if needed.

### 5. Run the Server
node Backend/server.js

The server will run at:
[http://localhost:3000](http://localhost:3000)


### 6. Open the Application
Homepage: [http://localhost:3000/homepage.html](http://localhost:3000/homepage.html)

