import { Hono } from "hono"; // Importing the Hono class
import { sign } from "hono/jwt"; // Importing the sign function from the jwt module
import { PrismaClient } from "@prisma/client/edge"; // Importing PrismaClient
import { withAccelerate } from "@prisma/extension-accelerate"; // Importing the Prisma Accelerate
import { signupShema, signinShema } from "../routes/zod"; // Importing the signupShema from the zod module

export const authRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();


// ====== Signup route for user ======
authRouter.post("/signup", async (c) => {
    const body = await c.req.json(); // Get the body of the request

    // ==== ZOD ====
    const { success } = signupShema.safeParse(body); // Validate the body against the schema
    if (!success) {
        c.status(411);
        return c.json({
            message: "Invalid data(Input data is not valid)"
        })
    }

    // ===== Prisma =====
    const prisma = new PrismaClient({ // Create a new PrismaClient instance.
        datasources: {
            db: {
                url: c.env.DATABASE_URL, // Get the DATABASE_URL from the environment
            },
        },
    }).$extends(withAccelerate()); // Extend the PrismaClient with the Prisma Accelerate

    try {
        // ============= Inserting a user in DB ==========================
        const auth = await prisma.auth.create({ // Create a new user using the create method
            data: {
                email: body.email,
                password: body.password,
                name: body.name,
            },
        });
        // =======================================

        // ===== JWT =====
        const jwt = await sign({
            id: auth.id,
        }, c.env.JWT_SECRET)

        // Return the response
        return c.json({
            message: "User created successfully",
            auth,
            jwt
        }); // Return success response
    } catch (e) {
        c.status(409); // Use the correct HTTP status code for conflicts
        return c.json({
            message: "User already exists",
        });
    } finally {
        await prisma.$disconnect(); // Ensure the PrismaClient connection is closed
    }
});

authRouter.post("/signin", async (c) => {
    const body = await c.req.json(); // Get the body of the request for signin

    const { success } = signinShema.safeParse(body); // Validate the body against the schema
    if (!success) {
        c.status(400); // 400 code for invalid data
        return c.json({
            message: "Invalid input data (Inputs are not correct)"
        });
    }

    // ===== prisma =====
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: c.env.DATABASE_URL // Get the DATABASE_URL from the environment
            }
        }
    }).$extends(withAccelerate()); // Extend the PrismaClient with the Prisma Accelerate

    try {
        // ============= Find the user in DB ==========================
        const auth = await prisma.auth.findFirst({ // Find the user with the email and password using findFirst
            where: {
                email: body.email,
                password: body.password
            }
        });
        // =======================================

        // ====== Check if the user exists ======
        if (!auth) {
            c.status(403); // 403 code for unauthorized access
            return c.json({
                message: "Invalid credentials"
            });
        }
        // ======================================

        // ===== JWT ===========
        const jwt = await sign({
            id: auth.id
        }, c.env.JWT_SECRET);
        // =====================

        // ==== Return the response ====
        return c.json({
            message: "User signed in successfully",
            jwt
        });
        // ============================
    } catch (e) {
        c.status(500); // 500 code for server error
        return c.json({
            message: "An unexpected error occurred"
        });
    } finally {
        await prisma.$disconnect(); // Ensure the PrismaClient connection is closed
    }
});

