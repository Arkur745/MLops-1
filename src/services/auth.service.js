import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
import { id } from 'zod/v4/locales';

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error(`Error hashing password:, ${error}`)
        throw new Error('Error hashing password')
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        logger.error(`Error comparing password:, ${error}`)
        throw new Error('Error validating password')
    }
}

export const authenticateUser = async (email, password) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user) {
            throw new Error('User not found');
        }

        const passwordValid = await comparePassword(password, user.password_hash);
        if (!passwordValid) {
            throw new Error('Invalid credentials');
        }

        return user;
    } catch (error) {
        logger.error(`Error authenticating user:, ${error}`)
        throw error;
    }
}

export const createUser = async({ name, email, password, role ='user'}) => {
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if(existingUser.length > 0) throw new Error('User with this email already exists');
        const passwordHash = await hashPassword(password);

        const [newUser] = await db.insert(users).values({name, email, password_hash: passwordHash, role}).returning({id: users.id, name: users.name, email: users.email, role: users.role});
        return newUser;
    } catch (error) {
        logger.error(`Error creating user:, ${error}`)
        throw new Error('Error creating user')
    }
}