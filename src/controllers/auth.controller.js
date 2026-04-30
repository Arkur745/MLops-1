import logger from "#config/logger.js";
import { signUpSchema, signInSchema } from "#valdations/auth.validation.js";
import { formatValidationErrors } from "#utils/format.js";
import { createUser, authenticateUser } from "#services/auth.service.js";
import { jwttoken } from "#utils/jwt.js";
import { cookies as cookieStore } from "#utils/cookies.js";

export const signup = async (req, res, next) => {
    try {
        const validationResult = signUpSchema.safeParse(req.body);

        if( !validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(validationResult.error)
            })
        }
        const { name, email, password, role } = validationResult.data;
        const user = await createUser({ name, email, password, role});

        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

        cookieStore.set(res, 'token', token);

        logger.info(`User ${email} signed up successfully`);
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        logger.error(error);
        if (error.message === 'User with this email already exists') {
            return res.status(409).json({ message: "email already exists" });
        }
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const validationResult = signInSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(validationResult.error)
            });
        }

        const { email, password } = validationResult.data;
        const user = await authenticateUser(email, password);

        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });
        cookieStore.set(res, 'token', token);

        logger.info(`User ${email} signed in successfully`);
        res.status(200).json({
            message: 'Signed in successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        logger.error(error);
        if (error.message === 'User not found' || error.message === 'Invalid credentials') {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        cookieStore.clear(res, 'token');
        logger.info('User signed out successfully');
        res.status(200).json({ message: 'Signed out successfully' });
    } catch (error) {
        logger.error(error);
        next(error);
    }
}
