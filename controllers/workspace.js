const { errorResponse, successResponse } = require('../utils/responseHandler')
const {
  workspaceValidation,
  workspaceInviteValidation,
  joinWorkspaceValidation
} = require('../utils/validators')
const { workspaceInvite } = require('../utils/sendEmail/emailHandler')
const {
  createWorkspaceAccount,
  getWorkspace,
  updateWorkspace,
  addAMember,
  joinAWorkspace,
  removeAMember,
  deleteAWorkspace,
  removeAMemberPending,
  updateAMemberRole
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

const updateMemberRole = async (req, res) => {
  try {
    const updatedWorkspace = await updateAMemberRole(req.params.workspaceId, req.params.userId)
    if (!updatedWorkspace) {
      return errorResponse(res, 401, 'No workspace or user not in workspace')
    }
    if (typeof updatedWorkspace === 'string') {
      return errorResponse(res, 400, updatedWorkspace)
    }
    return successResponse(res, 200, 'Workspace admin added!', updatedWorkspace)
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
  const { error } = workspaceInviteValidation({ email: req.body.email })
  if (error) return errorResponse(res, 400, error.details[0].message)
  try {
    const updated = await addAMember(req.params.workspaceId, req.body.email)
    if (!updated) {
      return errorResponse(res, 400, 'Member already in workspace')
    }

    const response = await workspaceInvite({
      email: req.body.email,
      inviteCode: updated.inviteCode,
      workspaceName: updated.name,
      inviteNote: req.body.inviteNote
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
      return successResponse(res, 200, 'Join Workspace succesful!', {
        workspaceId: joinedMember.workspace._id
      })
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
    if (typeof updatedWorkspace === 'string') {
      return errorResponse(res, 400, updatedWorkspace)
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
      return errorResponse(res, 400, 'Error deleting workspace')
    }
    return successResponse(res, 200, 'Workspace Deleted')
  } catch (error) {
    return errorResponse(res, 400, error.message)
  }
}

const removeMemberPending = async (req, res) => {
  try {
    const updatedWorkspace = await removeAMemberPending(
      req.params.workspaceId,
      req.params.userEmail
    )
    if (!updatedWorkspace) {
      return errorResponse(res, 400, 'Error deleting pending member')
    }
    return successResponse(res, 200, 'Pending member deleted')
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
  deleteWorkspace,
  removeMemberPending,
  updateMemberRole
}
