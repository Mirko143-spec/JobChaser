import { Router, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db, jobs } from '../db/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /jobs - get all jobs for the authenticated user (protected)
router.get('/jobs', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Only return jobs belonging to the authenticated user
    const userJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, req.user!.userId));

    res.status(200).json(userJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /jobs/:id - get a single job by id (protected - only own jobs)
router.get(
  '/jobs/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return res.status(400).json({ error: 'Invalid job id' });
    }

    try {
      const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check if job belongs to authenticated user
      if (job.userId !== req.user!.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.status(200).json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  }
);

// POST /jobs - create a job (protected - automatically assigns to authenticated user)
router.post(
  '/jobs',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const {
      externalJobId,
      company,
      logo,
      position,
      role,
      level,
      postedAt,
      contract,
    } = req.body;

    if (!company || !position) {
      return res.status(400).json({
        error: 'Missing required fields: company, position',
      });
    }

    try {
      const [job] = await db
        .insert(jobs)
        .values({
          userId: req.user!.userId, // Automatically use authenticated user's ID
          externalJobId,
          company,
          logo,
          position,
          role,
          level,
          postedAt,
          contract,
        })
        .returning();

      res.status(201).json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create job' });
    }
  }
);

// PUT /jobs/:id - replace a job (protected - only own jobs)
router.put(
  '/jobs/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const {
      externalJobId,
      company,
      logo,
      position,
      role,
      level,
      postedAt,
      contract,
    } = req.body;

    const jobId = Number(id);
    if (Number.isNaN(jobId)) {
      return res.status(400).json({ error: 'Invalid job id' });
    }

    if (!company || !position) {
      return res.status(400).json({
        error: 'Missing required fields: company, position',
      });
    }

    try {
      // Check if job exists and belongs to user
      const [existingJob] = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, jobId));

      if (!existingJob) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (existingJob.userId !== req.user!.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const [updated] = await db
        .update(jobs)
        .set({
          externalJobId,
          company,
          logo,
          position,
          role,
          level,
          postedAt,
          contract,
        })
        .where(eq(jobs.id, jobId))
        .returning();

      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update job' });
    }
  }
);

// PATCH /jobs/:id - update specific fields (protected - only own jobs)
router.patch(
  '/jobs/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateData: Partial<{
      externalJobId: string;
      company: string;
      logo: string;
      position: string;
      role: string;
      level: string;
      postedAt: string;
      contract: string;
    }> = {};

    const jobId = Number(id);
    if (Number.isNaN(jobId)) {
      return res.status(400).json({ error: 'Invalid job id' });
    }

    const {
      externalJobId,
      company,
      logo,
      position,
      role,
      level,
      postedAt,
      contract,
    } = req.body;

    if (externalJobId !== undefined) updateData.externalJobId = externalJobId;
    if (company !== undefined) updateData.company = company;
    if (logo !== undefined) updateData.logo = logo;
    if (position !== undefined) updateData.position = position;
    if (role !== undefined) updateData.role = role;
    if (level !== undefined) updateData.level = level;
    if (postedAt !== undefined) updateData.postedAt = postedAt;
    if (contract !== undefined) updateData.contract = contract;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    try {
      // Check if job exists and belongs to user
      const [existingJob] = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, jobId));

      if (!existingJob) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (existingJob.userId !== req.user!.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const [updated] = await db
        .update(jobs)
        .set(updateData)
        .where(eq(jobs.id, jobId))
        .returning();

      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update job' });
    }
  }
);

// DELETE /jobs/:id - delete a job (protected - only own jobs)
router.delete(
  '/jobs/:id',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const jobId = Number(id);

    if (Number.isNaN(jobId)) {
      return res.status(400).json({ error: 'Invalid job id' });
    }

    try {
      // Check if job exists and belongs to user
      const [existingJob] = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, jobId));

      if (!existingJob) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (existingJob.userId !== req.user!.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await db.delete(jobs).where(eq(jobs.id, jobId));

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete job' });
    }
  }
);

export default router;
