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

export const adminSigninSchema = z.object({
    email : z.string().email(),
    password : z.string()
})

export const adminDeviceSchema = z.object({
    model : z.string().max(15).trim(),
    company : z.string().max(15).trim(),
    image : z.string()
})

export const adminEmployeeSchema = z.object({
    name: z.string().max(15).trim(),
    email: z.string().email(),
    password: z.string().trim().regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/,
      'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
    ),
    image: z.string()
})

export const adminEmployeeUpdateSchema = z.object({
    name: z.string().max(15).trim(),
    email: z.string().email(),
    image : z.string()
})