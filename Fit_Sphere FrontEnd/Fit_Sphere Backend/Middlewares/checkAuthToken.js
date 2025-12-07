const jwt = require('jsonwebtoken');

// User Auth Token Handler
function checkAuthToken(req, res, next) {
  console.log('[checkAuthToken] raw header =>', req.headers.cookie);
  console.log('[checkAuthToken] parsed req.cookies =>', req.cookies);

  const token = req.cookies?.authToken || req.cookies?.token;
  if (!token) {
    return res.status(401).json({ ok: false, message: 'No authToken cookie' });
  }

  // then continue with JWT.decode/verify logic
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'Invalid authToken' });
  }
}

// Admin Auth Token Handler
function checkAdminToken(req, res, next) {
    const adminAuthToken = req.cookies.adminAuthToken;

    if (!adminAuthToken) {
        return res.status(401).json({ message: 'Admin authentication failed: No adminAuthToken provided', ok: false });
    }

    jwt.verify(adminAuthToken, process.env.JWT_ADMIN_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Admin authentication failed: Invalid adminAuthToken', ok: false });
        } else {
            // Admin auth token is valid, continue with the request
            req.adminId = decoded.adminId;
            next();
        }
    });
}

module.exports = checkAuthToken;
module.exports.checkAdminToken = checkAdminToken;