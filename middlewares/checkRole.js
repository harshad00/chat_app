// middleware/checkRole.js
export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
      try {
        const user = req.user;
  
        if (!user) {
          return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
  
        if (!allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
  
        next();
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
    };
  };
  