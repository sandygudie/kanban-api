const User = require('../models/user')

const getAllUserWorkspaces = async (id) => {
  const userWorkspaces = await User.findOne({
    _id: id
  }).populate({ path: 'workspace', select: '_id name members' })
  return userWorkspaces
}
module.exports = {
  getAllUserWorkspaces
}
