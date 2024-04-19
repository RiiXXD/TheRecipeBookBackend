# RecipeBook Backend

This repository contains the backend code for the RecipeBook project. The RecipeBook project is a web application that allows users to discover, create, and share recipes from various cuisines.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The RecipeBook backend is responsible for managing user authentication, recipe data storage, and serving RESTful APIs to interact with the frontend. It provides endpoints for user authentication, recipe management, and other functionalities required by the frontend application.

## Features

- User authentication: Users can sign up, log in, and log out securely using JWT (JSON Web Tokens) for authentication.
- Recipe management: Users can create, read, update, and delete recipes.
- Tagging and filtering: Recipes can be tagged with various attributes (e.g., cuisine, meal type) and filtered based on these tags.
- Pagination: Recipes are paginated to improve performance and usability.
- RESTful API: The backend provides a RESTful API for communication with the frontend, following standard HTTP methods and conventions.

## Technologies

The RecipeBook backend is built using the following technologies:

- **Node.js**: A JavaScript runtime for building scalable network applications.
- **Express.js**: A minimalist web framework for Node.js used to build the API endpoints.
- **MongoDB**: A NoSQL database used to store recipe data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Passport.js**: Authentication middleware for Node.js used for user authentication.
- **JSON Web Tokens (JWT)**: A standard for securely transmitting information between parties as JSON objects.
- **bcrypt**: A library for hashing passwords before storing them in the database.

## Installation

To run the RecipeBook backend locally, follow these steps:

1. Clone this repository to your local machine.
2. Install Node.js and MongoDB if you haven't already.
3. Install dependencies using `npm install`.
4. Create a `.env` file in the root directory and define environment variables such as `MONGODB_URI` and `JWT_SECRET`.
5. Run the server using `npm start`.

## Usage

Once the server is running, you can access the API endpoints using tools like Postman or integrate them into the frontend application of the RecipeBook project.

## API Documentation

The API documentation is available in the `docs` directory of this repository. It provides detailed information about each endpoint, including request/response formats and authentication requirements.

## Contributing

Contributions to the RecipeBook backend are welcome! To contribute, please fork this repository, make your changes, and submit a pull request. Be sure to follow the project's coding conventions and guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

