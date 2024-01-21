const User = require('../models/user')

const getAllUserWorkspaces = async (id) => {
  const user = await User.findOne({
    _id: id
  }).populate({ path: 'workspace', select: '_id name role members ' })
  return user
}
module.exports = {
  getAllUserWorkspaces
}
