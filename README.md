# Authentication API

This repository contains an authentication API with a `signin` endpoint for user login. It validates credentials, checks for existing users, and generates JSON Web Tokens (JWT) for secure authentication.

## Features

- Input validation using schemas.
- Prisma ORM integration with Prisma Accelerate.
- Secure JWT-based authentication.
- Comprehensive error handling.

## Tech Stack

- Node.js
- Prisma ORM
- Zod (Schema Validation)
- JWT

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project folder:
   ```bash
   cd <repository-folder>
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure the `.env` file:
   ```env
   DATABASE_URL=<your-database-connection-url>
   JWT_SECRET=<your-secret-key>
   ```

5. Start the application:
   ```bash
   npm start
   ```

## API Endpoints

### `POST /signin`

Authenticate a user and return a JWT.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Responses:**
- **200 OK**: Authentication successful.
  ```json
  {
    "message": "User signed in successfully",
    "jwt": "<token>"
  }
  ```
- **400 Bad Request**: Invalid input.
  ```json
  {
    "message": "Invalid input data (Inputs are not correct)"
  }
  ```
- **403 Forbidden**: Invalid credentials.
  ```json
  {
    "message": "Invalid credentials"
  }
  ```
- **500 Internal Server Error**: Unexpected error.
  ```json
  {
    "message": "An unexpected error occurred"
  }
  ```

## Contributing

Contributions are welcome! Fork the repo, create a branch, and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
