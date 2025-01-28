import z from 'zod'; // Import zod for schema validation

export const signupShema = z.object({
    email : z.string().email(),
    password : z.string().min(4),
    name : z.string()
})

export const signinShema = z.object({
    email : z.string().email(),
    password: z.string().min(4)
})