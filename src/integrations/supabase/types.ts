export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          commodity: string
          created_at: string
          id: string
          is_active: boolean
          last_triggered: string | null
          threshold_type: string
          threshold_value: number
          user_id: string | null
        }
        Insert: {
          commodity: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_triggered?: string | null
          threshold_type: string
          threshold_value: number
          user_id?: string | null
        }
        Update: {
          commodity?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_triggered?: string | null
          threshold_type?: string
          threshold_value?: number
          user_id?: string | null
        }
        Relationships: []
      }
      commodity_prices: {
        Row: {
          change_24h: number | null
          change_percent: number | null
          commodity: string
          currency: string
          id: string
          last_updated: string
          metadata: Json | null
          price: number
          retail_price: number | null
          source: string | null
        }
        Insert: {
          change_24h?: number | null
          change_percent?: number | null
          commodity: string
          currency?: string
          id?: string
          last_updated?: string
          metadata?: Json | null
          price: number
          retail_price?: number | null
          source?: string | null
        }
        Update: {
          change_24h?: number | null
          change_percent?: number | null
          commodity?: string
          currency?: string
          id?: string
          last_updated?: string
          metadata?: Json | null
          price?: number
          retail_price?: number | null
          source?: string | null
        }
        Relationships: []
      }
      daily_reports: {
        Row: {
          content: Json
          created_at: string
          id: string
          pdf_url: string | null
          report_date: string
          status: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          pdf_url?: string | null
          report_date: string
          status?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          pdf_url?: string | null
          report_date?: string
          status?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          close: number | null
          commodity: string
          created_at: string
          date: string
          high: number | null
          id: string
          low: number | null
          open: number | null
          price: number
          volume: number | null
        }
        Insert: {
          close?: number | null
          commodity: string
          created_at?: string
          date: string
          high?: number | null
          id?: string
          low?: number | null
          open?: number | null
          price: number
          volume?: number | null
        }
        Update: {
          close?: number | null
          commodity?: string
          created_at?: string
          date?: string
          high?: number | null
          id?: string
          low?: number | null
          open?: number | null
          price?: number
          volume?: number | null
        }
        Relationships: []
      }
      scraped_commodity_prices: {
        Row: {
          change_amount: number | null
          change_percent: number | null
          commodity_id: string
          created_at: string
          currency: string
          id: string
          price: number
          scraped_at: string
          source_url: string
        }
        Insert: {
          change_amount?: number | null
          change_percent?: number | null
          commodity_id: string
          created_at?: string
          currency?: string
          id?: string
          price: number
          scraped_at?: string
          source_url: string
        }
        Update: {
          change_amount?: number | null
          change_percent?: number | null
          commodity_id?: string
          created_at?: string
          currency?: string
          id?: string
          price?: number
          scraped_at?: string
          source_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
