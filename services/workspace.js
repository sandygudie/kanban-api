const createWorkspaceAccount = async (user, Workspace, body) => {
  const { name, description } = body
  const newWorkspace = await new Workspace({
    name,
    workspaceAdmin: user._id,
    description,
    role: 'admin'
  })
  await newWorkspace.members.push({ userId: user._id, role: 'admin' })
  // update user workspace

  const workspaceDetails = await newWorkspace.save()
  user.workspace = user.workspace.concat(workspaceDetails._id)
  await user.save()
  return workspaceDetails
}

module.exports = {
  createWorkspaceAccount
}
