const Workspace = require('../models/workspace')
const User = require('../models/user')
const { catchAsyncError } = require('../utils/responseHandler')
const { v4: uuidv4 } = require('uuid')

const createWorkspaceAccount = catchAsyncError(async (reqUser, body) => {
  const { workspaceName, profilePics } = body
  const { id, email } = reqUser
  const user = await User.findOne({
    _id: id
  })
  const newWorkspace = await new Workspace({
    name: workspaceName,
    workspaceAdmin: id,
    profilePics,
    role: 'admin',
    createdBy: user.name
  })

  newWorkspace.inviteCode = uuidv4().substring(0, 6)
  newWorkspace.members.push({
    userId: id,
    email,
    role: 'admin',
    name: user.name,
    profilePics: user.profilePics || null
  })

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

const updateAMemberRole = async (workspaceId, userId) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId
  })
  if (!workspace) {
    return null
  }

  const isWorkspaceUser = workspace.members.find((ele) => ele.userId === userId)
  if (isWorkspaceUser) {
    const adminCount = workspace.members.reduce(
      (counter, { role }) => (role === 'admin' ? (counter += 1) : counter),
      0
    )
    if (adminCount < 2) {
      const response = 'Assign admin to another member'
      return response
    }
    workspace.members = workspace.members.map((ele) => {
      if (ele.userId === userId) {
        return { ...ele, role: ele.role === 'admin' ? 'member' : 'admin' }
      }
      return ele
    })
    await workspace.save()
    return workspace
  } else {
    return null
  }
}

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
      workspace.members.push({
        userId: id,
        role: 'member',
        email,
        name: user.name,
        profilePics: user.profilePics
      })
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
  const checkMemberExist = workspace.members.find((ele) => ele.userId === userId)

  if (checkMemberExist) {
    const adminCount = workspace.members.reduce(
      (counter, { role }) => (role === 'admin' ? (counter += 1) : counter),
      0
    )
    if (adminCount < 2) {
      const response = 'Assign admin to another member'
      return response
    }
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

const removeAMemberPending = async (workspaceId, userEmail) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId
  })
  workspace.pendingMembers = workspace.pendingMembers.filter((ele) => ele !== userEmail)
  await workspace.save()
  return workspace
}

const deleteAWorkspace = async (workspaceId, userId) => {
  await Workspace.findByIdAndDelete(workspaceId)
  const updatedUserWorkspace = await User.findByIdAndUpdate(
    { _id: userId },
    { $pull: { workspace: workspaceId } },
    { new: true }
  )
  return { workspaceLeft: updatedUserWorkspace.workspace.length }
}

const addSocials = async (workspaceId, body) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId
  })
  workspace.socialLinks = body
  await workspace.save()
  return workspace
}

module.exports = {
  createWorkspaceAccount,
  getWorkspace,
  updateWorkspace,
  addAMember,
  joinAWorkspace,
  removeAMember,
  deleteAWorkspace,
  removeAMemberPending,
  updateAMemberRole,
  addSocials
}
