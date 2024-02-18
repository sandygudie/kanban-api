const Workspace = require('../models/workspace')

const verifyWorkspace = async (workspaceId) => {
  const workspace = await Workspace.findById({
    _id: workspaceId
  })
  return workspace
}

module.exports = {
  verifyWorkspace
}
