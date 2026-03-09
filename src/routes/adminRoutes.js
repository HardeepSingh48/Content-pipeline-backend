// src/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const prisma = require('../db/prismaClient');

// GET /api/admin/users - List all users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/admin/users/:userId/role - Update user role
router.patch('/users/:userId/role', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        // Validate role against Prisma enum
        if (!['USER', 'TESTER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Update user role
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        });

        res.json({
            success: true,
            message: `User role updated to ${role}`
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/signup-requests?status=PENDING|APPROVED|REJECTED
router.get('/signup-requests', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
            where.approvalStatus = status;
        }
        const users = await prisma.user.findMany({
            where,
            select: {
                id: true, email: true, fullName: true, companyName: true,
                companySize: true, industry: true, jobTitle: true,
                website: true, useCase: true, approvalStatus: true,
                rejectionNote: true, role: true, createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/admin/signup-requests/:id/approve
router.patch('/signup-requests/:id/approve', authenticateToken, isAdmin, async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { approvalStatus: 'APPROVED', rejectionNote: null },
            select: { id: true, email: true, approvalStatus: true },
        });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/admin/signup-requests/:id/reject
router.patch('/signup-requests/:id/reject', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { note } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { approvalStatus: 'REJECTED', rejectionNote: note || null },
            select: { id: true, email: true, approvalStatus: true },
        });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
