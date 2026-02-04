import { inngest, type GdprReminderEvent } from '../client'

// GDPR reminder job
// Sends reminders for pending GDPR requests
export const gdprReminder = inngest.createFunction(
  {
    id: 'gdpr-reminder',
    name: 'GDPR Request Reminder',
    retries: 2,
  },
  { event: 'gdpr/reminder' },
  async ({ event, step }) => {
    const { requestId, userId, targetEntity } = event.data

    // Check if request is still pending
    const request = await step.run('check-request-status', async () => {
      // TODO: Fetch request from Supabase
      console.log(`Checking status of GDPR request ${requestId}`)
      return { id: requestId, status: 'sent' }
    })

    if (request.status !== 'sent') {
      return { skipped: true, reason: 'Request no longer pending' }
    }

    // Send reminder email
    await step.run('send-reminder-email', async () => {
      // TODO: Send email via Resend
      console.log(`Sending reminder for request ${requestId} to user ${userId}`)
      return { sent: true }
    })

    // Update reminder timestamp
    await step.run('update-reminder-timestamp', async () => {
      // TODO: Update in Supabase
      console.log(`Updated reminder timestamp for request ${requestId}`)
      return { updated: true }
    })

    return { success: true, requestId }
  }
)

// Scheduled job to check for overdue requests
export const checkOverdueRequests = inngest.createFunction(
  {
    id: 'check-overdue-requests',
    name: 'Check Overdue GDPR Requests',
  },
  { cron: '0 9 * * *' }, // Run daily at 9 AM
  async ({ step }) => {
    // Find requests that are overdue (>30 days without response)
    const overdueRequests = await step.run('find-overdue', async () => {
      // TODO: Query Supabase for overdue requests
      console.log('Checking for overdue GDPR requests')
      return [] as Array<{ id: string }>
    })

    // Send notifications for each
    for (const request of overdueRequests) {
      if (request) {
        await step.run(`notify-overdue-${request.id}`, async () => {
          // TODO: Send notification
          console.log(`Request ${request.id} is overdue`)
          return { notified: true }
        })
      }
    }

    return { checked: overdueRequests.length }
  }
)
