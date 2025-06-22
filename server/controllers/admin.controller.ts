import { Request, Response } from 'express';
import { User } from '../models/user.model';

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req: Request, res: Response) => {
    // In a real app, this data would be calculated from your database
    const mockAnalytics = {
        revenueData: [
            { month: 'Jan', revenue: 4000, expenses: 2400 },
            { month: 'Feb', revenue: 3000, expenses: 1398 },
            { month: 'Mar', revenue: 5000, expenses: 6800 },
            { month: 'Apr', revenue: 4780, expenses: 3908 },
            { month: 'May', revenue: 6890, expenses: 4800 },
            { month: 'Jun', revenue: 7390, expenses: 3800 },
        ],
        subscriptionData: [
            { name: 'Jan', Pro: 400, Premium: 240 },
            { name: 'Feb', Pro: 300, Premium: 139 },
            { name: 'Mar', Pro: 200, Premium: 480 },
            { name: 'Apr', Pro: 278, Premium: 390 },
            { name: 'May', Pro: 189, Premium: 480 },
            { name: 'Jun', Pro: 239, Premium: 380 },
        ],
        kpiData: {
            mrr: { value: 7390, change: 12.5 },
            activeSubscriptions: { value: 619, change: 5.2 },
            arpu: { value: 11.94, change: 2.1 },
            churnRate: { value: 2.3, change: -0.5 },
            ltv: { value: 245, change: 15 },
            cac: { value: 42, change: 3 },
        }
    };
    res.json(mockAnalytics);
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
export const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await User.find({ role: 'student' });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new student
// @route   POST /api/admin/students
// @access  Private/Admin
export const addStudent = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    // In a real app, you'd likely want to send them a welcome email with a temporary password
    const tempPassword = 'password123'; // Placeholder
    
    try {
        const newStudent = await User.create({
            firstName: name.split(' ')[0] || '',
            lastName: name.split(' ')[1] || '',
            email,
            password: tempPassword,
            role: 'student',
        });
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create student' });
    }
};

// @desc    Grant CodeCoins to a student
// @route   POST /api/admin/students/:id/grant-coins
// @access  Private/Admin
export const grantCoins = async (req: Request, res: Response) => {
    const { amount } = req.body;
    const { id } = req.params;

    try {
        const student = await User.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        student.codeCoins += Number(amount);
        await student.save();
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Failed to grant coins' });
    }
}; 