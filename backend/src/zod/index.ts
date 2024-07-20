import z from 'zod'

export const userSigninSchema = z.object({
    id : z.string(),
    password : z.string()
})

export const userProfileSchema = z.object({
    name: z.string(),
    image : z.string()
})

export const userPasswordSchema = z.object({
    oldPassword: z.string().optional(),
    password: z.string().trim().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/, 'Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one digit, and one special character') 
})

export const adminLogStatusSchema = z.object({
    status: z.enum(['Accepted', 'Rejected'])
})