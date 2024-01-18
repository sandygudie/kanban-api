const { PORT } = require('./config/index')
const app = require('./app')
// const { job } = require('./cron')

// job.start()
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
