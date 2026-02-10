const prisma = require('../prismaClient');

// DELETE /api/transactions/:id
exports.cancelRequest = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const transaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        // Ensure user owns the transaction and it is pending
        if (transaction.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        if (transaction.status !== 'pending') {
            return res.status(400).json({ error: "Cannot cancel a processed transaction" });
        }

        await prisma.transaction.delete({ where: { id: Number(id) } });
        res.json({ message: "Request cancelled successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// POST /api/borrow
// POST /api/transactions/borrow
exports.createTransaction = async (req, res) => {
    let { userId, assetId, dueDate, reason } = req.body;
    let localUserId = null;

    try {
        // --- 1. HANDLE CLERK USER (String ID) ---
        // If req.user.id is a String (Clerk ID), we must map it to a Local DB User (Int ID)
        if (typeof req.user.id === 'string' && req.user.id.startsWith('user_')) {
            // Check if this Clerk User already has a local account
            const clerkStudentId = `clerk_${req.user.id}`;
            let localUser = await prisma.user.findUnique({ where: { studentId: clerkStudentId } });

            if (!localUser) {
                // First time login/borrow? Create a local shadow user
                localUser = await prisma.user.create({
                    data: {
                        studentId: clerkStudentId,
                        passwordHash: "clerk_auth_managed", // Dummy password
                        role: "student"
                    }
                });
            }
            localUserId = localUser.id;
        }
        // --- 2. HANDLE LEGACY USER (Int ID) ---
        else {
            // For legacy login, req.user.id is already an Int (from JWT)
            // Security Check: Ensure they are borrowing for themselves
            if (req.user.id !== Number(userId) && req.user.role !== 'admin') {
                return res.status(403).json({ error: "Unauthorized transaction request" });
            }
            localUserId = Number(userId);
        }

        // --- 3. VALIDATE ASSET ---
        const asset = await prisma.asset.findUnique({ where: { id: Number(assetId) } });
        if (!asset || asset.status !== 'available') {
            return res.status(400).json({ error: 'Asset not available' });
        }

        // --- 4. CREATE TRANSACTION ---
        const transaction = await prisma.transaction.create({
            data: {
                userId: localUserId, // Use the resolved Integer ID
                assetId: Number(assetId),
                dueDate: new Date(dueDate),
                reason: reason,
                status: 'pending'
            }
        });
        res.json(transaction);

    } catch (err) {
        console.error("Borrow Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// GET /api/admin/transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            include: { user: true, asset: true },
            orderBy: { borrowDate: 'desc' }
        });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/admin/transactions/:id/approve
exports.approveTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findUnique({ where: { id: Number(id) } });
            if (!transaction) throw new Error("Transaction not found");

            const asset = await tx.asset.findUnique({ where: { id: transaction.assetId } });
            if (!asset) throw new Error("Asset not found");

            if (asset.status !== 'available') {
                throw new Error("Asset is not available (already borrowed or in maintenance)");
            }

            const updatedTx = await tx.transaction.update({
                where: { id: Number(id) },
                data: { status: 'approved' }
            });

            await tx.asset.update({
                where: { id: transaction.assetId },
                data: { status: 'borrowed' }
            });

            return updatedTx;
        });
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT /api/admin/transactions/:id/reject
exports.rejectTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await prisma.transaction.update({
            where: { id: Number(id) },
            data: { status: 'rejected' }
        });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/admin/transactions/:id/return
exports.returnTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findUnique({ where: { id: Number(id) } });
            if (!transaction) throw new Error("Transaction not found");

            const updatedTx = await tx.transaction.update({
                where: { id: Number(id) },
                data: {
                    status: 'returned',
                    returnDate: new Date()
                }
            });

            await tx.asset.update({
                where: { id: transaction.assetId },
                data: { status: 'available' }
            });

            return updatedTx;
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/transactions/my-history
exports.getMyHistory = async (req, res) => {
    let userId = req.user.id;
    let localUserId = Number(userId);

    try {
        // --- HANDLE CLERK USER (String ID) ---
        if (typeof userId === 'string' && userId.startsWith('user_')) {
            const clerkStudentId = `clerk_${userId}`;
            const localUser = await prisma.user.findUnique({ where: { studentId: clerkStudentId } });

            if (!localUser) {
                // If user doesn't exist in DB yet, they have no history
                return res.json([]);
            }
            localUserId = localUser.id;
        }

        const transactions = await prisma.transaction.findMany({
            where: { userId: localUserId },
            include: { asset: true },
            orderBy: [
                { status: 'asc' },
                { borrowDate: 'desc' }
            ]
        });

        // Custom sort to prioritize Pending and Approved
        const statusOrder = { 'pending': 1, 'approved': 2, 'borrowed': 2, 'returned': 3, 'rejected': 4 };
        transactions.sort((a, b) => {
            const orderA = statusOrder[a.status] || 99;
            const orderB = statusOrder[b.status] || 99;
            if (orderA !== orderB) return orderA - orderB;
            return new Date(b.borrowDate) - new Date(a.borrowDate);
        });

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
