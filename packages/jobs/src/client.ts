import { Inngest } from 'inngest'

// Create the Inngest client
export const inngest = new Inngest({
  id: 'huella-digital',
  name: 'Huella Digital',
})

// Event types
export type SearchExecuteEvent = {
  name: 'search/execute'
  data: {
    searchId: string
    userId: string
    queryName: string
    queryEmail?: string
    queryUsernames?: string[]
  }
}

export type GdprReminderEvent = {
  name: 'gdpr/reminder'
  data: {
    requestId: string
    userId: string
    targetEntity: string
  }
}

export type CleanupEvent = {
  name: 'cleanup/expired-data'
  data: Record<string, never>
}

// Union of all events
export type AppEvents = SearchExecuteEvent | GdprReminderEvent | CleanupEvent
