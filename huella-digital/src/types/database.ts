export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserPlan = 'free' | 'pro' | 'enterprise'
export type UserLanguage = 'es' | 'en'
export type SearchStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type ResultCategory = 'social_media' | 'forum' | 'news' | 'data_breach' | 'professional' | 'government' | 'other'
export type ResultSeverity = 'low' | 'medium' | 'high' | 'critical'
export type GdprRequestType = 'erasure' | 'access' | 'rectification' | 'portability'
export type GdprRequestStatus = 'draft' | 'ready' | 'sent' | 'acknowledged' | 'completed' | 'rejected' | 'escalated'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          encrypted_email: string | null
          language: UserLanguage
          plan: UserPlan
          searches_today: number
          searches_reset_at: string
          onboarding_completed: boolean
          gdpr_consent: boolean
          gdpr_consent_at: string | null
          marketing_consent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          encrypted_email?: string | null
          language?: UserLanguage
          plan?: UserPlan
          searches_today?: number
          searches_reset_at?: string
          onboarding_completed?: boolean
          gdpr_consent?: boolean
          gdpr_consent_at?: string | null
          marketing_consent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          encrypted_email?: string | null
          language?: UserLanguage
          plan?: UserPlan
          searches_today?: number
          searches_reset_at?: string
          onboarding_completed?: boolean
          gdpr_consent?: boolean
          gdpr_consent_at?: string | null
          marketing_consent?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      searches: {
        Row: {
          id: string
          user_id: string
          query_name: string
          query_email: string | null
          query_usernames: string[] | null
          status: SearchStatus
          error_message: string | null
          total_results: number
          results_by_category: Json
          results_by_severity: Json
          sources_queried: string[]
          sources_completed: string[]
          sources_failed: string[]
          created_at: string
          started_at: string | null
          completed_at: string | null
          expires_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          user_id: string
          query_name: string
          query_email?: string | null
          query_usernames?: string[] | null
          status?: SearchStatus
          error_message?: string | null
          total_results?: number
          results_by_category?: Json
          results_by_severity?: Json
          sources_queried?: string[]
          sources_completed?: string[]
          sources_failed?: string[]
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
          expires_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          query_name?: string
          query_email?: string | null
          query_usernames?: string[] | null
          status?: SearchStatus
          error_message?: string | null
          total_results?: number
          results_by_category?: Json
          results_by_severity?: Json
          sources_queried?: string[]
          sources_completed?: string[]
          sources_failed?: string[]
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
          expires_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      search_results: {
        Row: {
          id: string
          search_id: string
          source: string
          source_query: string | null
          url: string | null
          title: string | null
          snippet: string | null
          thumbnail_url: string | null
          category: ResultCategory
          severity: ResultSeverity
          confidence_score: number
          breach_name: string | null
          breach_date: string | null
          breach_data_classes: string[] | null
          metadata: Json
          found_at: string
          is_dismissed: boolean
          dismissed_at: string | null
          has_gdpr_request: boolean
        }
        Insert: {
          id?: string
          search_id: string
          source: string
          source_query?: string | null
          url?: string | null
          title?: string | null
          snippet?: string | null
          thumbnail_url?: string | null
          category?: ResultCategory
          severity?: ResultSeverity
          confidence_score?: number
          breach_name?: string | null
          breach_date?: string | null
          breach_data_classes?: string[] | null
          metadata?: Json
          found_at?: string
          is_dismissed?: boolean
          dismissed_at?: string | null
          has_gdpr_request?: boolean
        }
        Update: {
          id?: string
          search_id?: string
          source?: string
          source_query?: string | null
          url?: string | null
          title?: string | null
          snippet?: string | null
          thumbnail_url?: string | null
          category?: ResultCategory
          severity?: ResultSeverity
          confidence_score?: number
          breach_name?: string | null
          breach_date?: string | null
          breach_data_classes?: string[] | null
          metadata?: Json
          found_at?: string
          is_dismissed?: boolean
          dismissed_at?: string | null
          has_gdpr_request?: boolean
        }
      }
      gdpr_requests: {
        Row: {
          id: string
          user_id: string
          search_result_id: string | null
          template_id: string | null
          request_type: GdprRequestType
          target_entity: string
          target_email: string | null
          target_address: string | null
          target_country: string | null
          subject: string
          body: string
          pdf_url: string | null
          pdf_expires_at: string | null
          status: GdprRequestStatus
          sent_at: string | null
          sent_method: string | null
          acknowledged_at: string | null
          response_at: string | null
          response_summary: string | null
          escalated_to: string | null
          escalated_at: string | null
          reminder_sent_at: string | null
          next_reminder_at: string | null
          created_at: string
          updated_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          search_result_id?: string | null
          template_id?: string | null
          request_type: GdprRequestType
          target_entity: string
          target_email?: string | null
          target_address?: string | null
          target_country?: string | null
          subject: string
          body: string
          pdf_url?: string | null
          pdf_expires_at?: string | null
          status?: GdprRequestStatus
          sent_at?: string | null
          sent_method?: string | null
          acknowledged_at?: string | null
          response_at?: string | null
          response_summary?: string | null
          escalated_to?: string | null
          escalated_at?: string | null
          reminder_sent_at?: string | null
          next_reminder_at?: string | null
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          search_result_id?: string | null
          template_id?: string | null
          request_type?: GdprRequestType
          target_entity?: string
          target_email?: string | null
          target_address?: string | null
          target_country?: string | null
          subject?: string
          body?: string
          pdf_url?: string | null
          pdf_expires_at?: string | null
          status?: GdprRequestStatus
          sent_at?: string | null
          sent_method?: string | null
          acknowledged_at?: string | null
          response_at?: string | null
          response_summary?: string | null
          escalated_to?: string | null
          escalated_at?: string | null
          reminder_sent_at?: string | null
          next_reminder_at?: string | null
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
      }
      request_templates: {
        Row: {
          id: string
          type: GdprRequestType
          language: UserLanguage
          name: string
          description: string | null
          subject: string
          body: string
          legal_basis: string
          legal_notes: string | null
          is_default: boolean
          is_active: boolean
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: GdprRequestType
          language: UserLanguage
          name: string
          description?: string | null
          subject: string
          body: string
          legal_basis: string
          legal_notes?: string | null
          is_default?: boolean
          is_active?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: GdprRequestType
          language?: UserLanguage
          name?: string
          description?: string | null
          subject?: string
          body?: string
          legal_basis?: string
          legal_notes?: string | null
          is_default?: boolean
          is_active?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_plan: UserPlan
      user_language: UserLanguage
      search_status: SearchStatus
      result_category: ResultCategory
      result_severity: ResultSeverity
      gdpr_request_type: GdprRequestType
      gdpr_request_status: GdprRequestStatus
    }
  }
}
