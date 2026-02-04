import { inngest } from '../client'

// Cleanup expired data job
// Runs daily to remove old searches and PDFs
export const cleanupExpiredData = inngest.createFunction(
  {
    id: 'cleanup-expired-data',
    name: 'Cleanup Expired Data',
  },
  { cron: '0 3 * * *' }, // Run daily at 3 AM
  async ({ step }) => {
    // Delete expired searches
    const deletedSearches = await step.run('delete-expired-searches', async () => {
      // TODO: Delete from Supabase where expires_at < NOW()
      console.log('Deleting expired searches')
      return { count: 0 }
    })

    // Clean up expired PDFs from storage
    const deletedPdfs = await step.run('delete-expired-pdfs', async () => {
      // TODO: Delete from Supabase Storage
      console.log('Deleting expired PDFs')
      return { count: 0 }
    })

    // Delete old audit logs (>90 days)
    const deletedLogs = await step.run('delete-old-audit-logs', async () => {
      // TODO: Delete from Supabase
      console.log('Deleting old audit logs')
      return { count: 0 }
    })

    // Reset daily search counters
    await step.run('reset-daily-counters', async () => {
      // TODO: Reset searches_today for users where searches_reset_at < today
      console.log('Resetting daily search counters')
      return { reset: true }
    })

    return {
      deletedSearches: deletedSearches.count,
      deletedPdfs: deletedPdfs.count,
      deletedLogs: deletedLogs.count,
    }
  }
)
