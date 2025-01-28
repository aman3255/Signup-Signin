import { Hono } from 'hono';
import { authRouter } from './routes/auth';

const app = new Hono();

// Importing the Routes
app.route("api/v1/auth", authRouter); // Route for auth

export default app;
