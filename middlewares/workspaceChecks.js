const Workspace = require('../models/workspace')

const verifyWorkspace = async (workspaceId) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId
  })
  return workspace
}

module.exports = {
  verifyWorkspace
}
