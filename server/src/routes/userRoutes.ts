import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db, users } from '../db/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

//GET get current user (protected)
router.get(
  '/users/me',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, req.user!.userId),
        with: { jobs: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
);

//GET get one user by id (protected - only own profile)
router.get(
  '/users/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const userId = Number(id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    // Only allow users to view their own profile
    if (userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    try {
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
        with: { jobs: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
);

//POST create a user (hash password)
router.post('/users', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: name, email, password' });
  }

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning();

    // Don't return password in response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

//PUT update one user (protected - hash password if provided)
router.put(
  '/users/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const userId = Number(id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    // Only allow users to update their own profile
    if (userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!name || !email) {
      return res
        .status(400)
        .json({ error: 'Missing required fields: name, email' });
    }

    try {
      const updateData: { name: string; email: string; password?: string } = {
        name,
        email,
      };

      // Only hash and update password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const [updated] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Don't return password in response
      const { password: _, ...userWithoutPassword } = updated;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

//DELETE remove a user (protected - only own account)
router.delete(
  '/users/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const userId = Number(id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    // Only allow users to delete their own account
    if (userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    try {
      const [deleted] = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
);

export default router;
