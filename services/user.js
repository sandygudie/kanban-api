const User = require('../models/user')
const Workspace = require('../models/workspace')

const getAllUserWorkspaces = async (id) => {
  const userWorkspaces = await User.findOne({
    _id: id
  }).populate({ path: 'workspace', select: '_id name members' })
  return userWorkspaces
}
const updateAUser = async (userId, body) => {
  const updatedUser = User.findByIdAndUpdate(userId, body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  return updatedUser
}

const deleteAUser = async (workspaceId, userId) => {
  await User.findByIdAndDelete(userId)

  const workspace = await Workspace.findOne({ _id: workspaceId })
  const user = workspace.member.find((ele) => ele.id === userId)
  if (user.role === 'admin') {
    // if user is admin of workspace, // he has to assign admin to someone else before deleting
  } else {
    workspace.member.filter((ele) => ele._id !== userId)
  }

  return workspace
}
module.exports = {
  getAllUserWorkspaces,
  updateAUser,
  deleteAUser
}
