const User = require('../models/user')
const Workspace = require('../models/workspace')

const getAllUserWorkspaces = async (id) => {
  const userWorkspaces = await User.findOne({
    _id: id
  }).populate({ path: 'workspace', select: '_id name members profilePics boards' })
  return userWorkspaces
}

const updateAUser = async (userId, body) => {
  const updatedUser = await User.findByIdAndUpdate(userId, body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  const userWorkspaces = await User.findOne({
    _id: userId
  }).populate({
    path: 'workspace',
    select: 'profilePics members',
    populate: {
      path: 'members',
      select: 'userId profilePics'
    }
  })

  userWorkspaces.workspace.map(async (ele) => {
    const workspace = await Workspace.findOne({ _id: ele._id })
    const user = await workspace.members.find((item) => item.userId === userId)
    user.profilePics = updatedUser.profilePics
    await workspace.save()
    return ele
  })

  return updatedUser
}

const deleteAUser = async (workspaceId, userId) => {
  await User.findByIdAndDelete(userId)

  const workspace = await Workspace.findOne({ _id: workspaceId })
  const user = workspace.members.find((ele) => ele.id === userId)
  if (user.role === 'admin') {
    // if user is admin of workspace, // he has to assign admin to someone else before deleting
  } else {
    workspace.members.filter((ele) => ele._id !== userId)
  }

  return workspace
}
module.exports = {
  getAllUserWorkspaces,
  updateAUser,
  deleteAUser
}
