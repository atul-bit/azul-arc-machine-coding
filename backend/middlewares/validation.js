const validateEmployee = (req, res, next) => {
    // For form-data, values come from req.body after multer processing
    const { name, email } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return res.status(400).json({ error: 'Name should contain only alphabets and spaces' });
    }

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    next();
};

module.exports = {
    validateEmployee,
};