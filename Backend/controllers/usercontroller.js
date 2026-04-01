const User = require('../models/User');

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Name
    if (req.body.name !== undefined)     user.name     = req.body.name     || user.name;
    // Email
    if (req.body.email !== undefined)    user.email    = req.body.email    || user.email;
    // Phone
    if (req.body.phone !== undefined)    user.phone    = req.body.phone;
    // Location — frontend may send as "location" or "address"
    const loc = req.body.location || req.body.address;
    if (loc !== undefined)               user.location = loc;
    if (loc !== undefined)               user.address  = loc;   // keep address in sync too
    // Username
    if (req.body.username !== undefined) user.username = req.body.username;
    // Bio
    if (req.body.bio !== undefined)      user.bio      = req.body.bio;
    // Profile photo
    if (req.body.profilePhoto !== undefined) user.profilePhoto = req.body.profilePhoto;

    const updatedUser = await user.save();

    res.json({
      _id:          updatedUser._id,
      name:         updatedUser.name,
      username:     updatedUser.username || "",
      email:        updatedUser.email,
      phone:        updatedUser.phone    || "",
      location:     updatedUser.location || updatedUser.address || "",
      bio:          updatedUser.bio      || "",
      role:         updatedUser.role,
      profilePhoto: updatedUser.profilePhoto,
    });
  } catch (error) {
    console.error('[updateProfile]', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateProfile };
