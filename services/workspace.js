const Workspace = require('../models/workspace')
const User = require('../models/user')
const { catchAsyncError } = require('../utils/responseHandler')
const { v4: uuidv4 } = require('uuid')

const createWorkspaceAccount = catchAsyncError(async (reqUser, body) => {
  const { workspaceName, description } = body
  const { id, email } = reqUser

  const user = await User.findOne({
    _id: id
  })

  const newWorkspace = await new Workspace({
    name: workspaceName,
    workspaceAdmin: id,
    description,
    profilePics:
      'https://res.cloudinary.com/dvpoiwd0t/image/upload/v1709064575/workspace-placeholder_urnll6.webp',
    role: 'admin',
    createdBy: user.name
  })
  newWorkspace.inviteCode = uuidv4().substring(0, 6)
  newWorkspace.members.push({ userId: id, email, role: 'admin', name: user.name })

  const workspaceDetails = await newWorkspace.save()
  user.workspace = user.workspace.concat(workspaceDetails._id)
  await user.save()
  return workspaceDetails
})

const getWorkspace = catchAsyncError(async (workspaceId, userId) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId
  })
  if (!workspace) {
    return null
  }
  const isWorkspaceUser = workspace.members.find((ele) => ele.userId === userId)
  if (isWorkspaceUser) {
    return workspace
  } else {
    return null
  }
})

const updateWorkspace = catchAsyncError(async (workspaceId, body) => {
  const updatedWorkspace = await Workspace.findByIdAndUpdate(workspaceId, body, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  return updatedWorkspace
})

const addAMember = catchAsyncError(async (workspaceId, email) => {
  let updated
  const workspace = await Workspace.findOne({
    _id: workspaceId
  })
  const checkMemberExist = workspace.members.find((ele) => ele.email === email)

  if (checkMemberExist) {
    updated = null
  } else {
    workspace.pendingMembers.push(email)
    workspace.pendingMembers = [...new Set(workspace.pendingMembers)]
    updated = await workspace.save()
  }
  return updated
})

const joinAWorkspace = catchAsyncError(async (body, user) => {
  const updated = {}
  const { inviteCode, workspaceName } = body
  const { id, email } = user
  const workspace = await Workspace.findOne({
    inviteCode,
    name: workspaceName
  })
  if (!workspace) {
    updated.error = 'No workspace'
  } else {
    const isUserEmail = workspace.pendingMembers.includes(email)
    if (!isUserEmail) {
      updated.emailError = 'Request admin invite'
    } else {
      const user = await User.findOne({
        _id: id
      })
      workspace.pendingMembers = workspace.pendingMembers.filter((ele) => ele !== email)
      workspace.members.push({ userId: id, role: 'member', email, name: user.name })
      await workspace.save()
      updated.workspace = workspace

      user.workspace = user.workspace.concat(workspace._id)
      await user.save()
    }
  }
  return updated
})

const removeAMember = catchAsyncError(async (params) => {
  const { workspaceId, userId } = params
  let updated
  const workspace = await Workspace.findOne({
    _id: workspaceId
  })
  const checkMemberExist = workspace.members.find(
    (ele) => ele.userId === userId && ele.role === 'member'
  )

  if (checkMemberExist) {
    await Workspace.updateOne(
      {
        _id: workspaceId
      },

      { $pull: { members: { userId } } }
    )

    const user = await User.findOne({
      _id: userId
    })
    user.workspace = user.workspace.filter((ele) => ele._id === workspaceId)
    await user.save()
    return workspace
  } else {
    updated = null
  }
  return updated
})

const deleteAWorkspace = catchAsyncError(async (workspaceId, userId) => {
  const updatedWorkspace = await Workspace.findByIdAndDelete(workspaceId)
  await User.updateOne({ _id: userId }, { $pull: { workspace: workspaceId } })
  return updatedWorkspace
})

module.exports = {
  createWorkspaceAccount,
  getWorkspace,
  updateWorkspace,
  addAMember,
  joinAWorkspace,
  removeAMember,
  deleteAWorkspace
}
