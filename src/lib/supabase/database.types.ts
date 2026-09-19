export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      search_queries: {
        Row: {
          created_at: string
          id: string
          normalized_query: string
          query: string
          trigger: string
        }
        Insert: {
          created_at?: string
          id?: string
          normalized_query: string
          query: string
          trigger: string
        }
        Update: {
          created_at?: string
          id?: string
          normalized_query?: string
          query?: string
          trigger?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      suggest_search_queries: {
        Args: { prefix: string }
        Returns: { hits: number; query: string }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
