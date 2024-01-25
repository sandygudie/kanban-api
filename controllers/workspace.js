const { errorResponse, successResponse } = require('../utils/responseHandler')
const { workspaceValidation, ValidEmail, joinWorkspaceValidation } = require('../utils/validators')
const { workspaceInvite } = require('../utils/sendEmail/emailHandler')
const {
  createWorkspaceAccount,
  getWorkspace,
  updateWorkspace,
  addAMember,
  joinAWorkspace,
  removeAMember,
  deleteAWorkspace
} = require('../services/workspace')

const createWorkspace = async (req, res) => {
  const { error } = workspaceValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    const workspaceDetails = await createWorkspaceAccount(req.user, req.body)
    return successResponse(res, 201, 'Workspace Created!', { workspaceId: workspaceDetails._id })
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const getAWorkspace = async (req, res) => {
  try {
    const workspace = await getWorkspace(req.params.workspaceId, req.user.id)
    if (!workspace) {
      return errorResponse(res, 401, 'No workspace')
    }
    return successResponse(res, 200, 'Workspace retrieved!', workspace)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const updateAWorkspace = async (req, res) => {
  try {
    const updatedWorkspace = await updateWorkspace(req.params.workspaceId, req.body)
    return successResponse(res, 200, 'Workspace updated!', updatedWorkspace)
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const addWorkspaceMember = async (req, res) => {
  const { error } = ValidEmail(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    const updated = await addAMember(req.params.workspaceId, req.body.email)
    if (!updated) {
      return errorResponse(res, 400, 'Member already in workspace')
    }
    const response = await workspaceInvite({
      email: req.body.email,
      inviteCode: updated.inviteCode,
      name: updated.name
    })

    if (response.message) {
      return errorResponse(res, 400, 'Error sending invite')
    } else {
      return successResponse(res, 200, 'Workspace invite sent!', updated)
    }
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const joinWorkspace = async (req, res) => {
  const { error } = joinWorkspaceValidation(req.body)
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    const joinedMember = await joinAWorkspace(req.body, req.user)
    if (joinedMember.error) {
      return errorResponse(res, 400, joinedMember.error)
    } else if (joinedMember.emailError) {
      return errorResponse(res, 400, joinedMember.emailError)
    } else {
      return successResponse(res, 200, 'Join Workspace succesful!', joinedMember.workspace)
    }
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}
const deleteMemberWorkspace = async (req, res) => {
  try {
    const updatedWorkspace = await removeAMember(req.params)
    if (!updatedWorkspace) {
      return errorResponse(res, 400, 'No existing Member')
    }
    return successResponse(res, 200, 'Member removed from workspace')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}
const deleteWorkspace = async (req, res) => {
  try {
    const updatedWorkspace = await deleteAWorkspace(req.params.workspaceId, req.user.id)
    if (!updatedWorkspace) {
      return errorResponse(res, 400, 'Error deleting Workspace')
    }
    return successResponse(res, 200, 'Workspace Deleted')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}
module.exports = {
  createWorkspace,
  getAWorkspace,
  updateAWorkspace,
  addWorkspaceMember,
  joinWorkspace,
  deleteMemberWorkspace,
  deleteWorkspace
}
