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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ad_slots: {
        Row: {
          ad_code: string
          created_at: string
          display_order: number
          id: string
          is_enabled: boolean
          name: string
          placement: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          ad_code?: string
          created_at?: string
          display_order?: number
          id?: string
          is_enabled?: boolean
          name: string
          placement?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          ad_code?: string
          created_at?: string
          display_order?: number
          id?: string
          is_enabled?: boolean
          name?: string
          placement?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          created_by: string | null
          excerpt: string
          featured_image: string
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          read_time: string
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string
          featured_image?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: string
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string
          featured_image?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: string
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_tools: {
        Row: {
          category: string
          color: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string
          embed_url: string
          html_content: string
          icon_name: string
          id: string
          is_enabled: boolean
          meta_description: string
          meta_keywords: string
          meta_title: string
          name: string
          slug: string
          updated_at: string
          view_count: number
        }
        Insert: {
          category?: string
          color?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string
          embed_url?: string
          html_content?: string
          icon_name?: string
          id?: string
          is_enabled?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          name: string
          slug: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          category?: string
          color?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string
          embed_url?: string
          html_content?: string
          icon_name?: string
          id?: string
          is_enabled?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          name?: string
          slug?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          tool_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tool_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tool_id?: string
          user_id?: string
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          canonical_url: string
          id: string
          is_enabled: boolean
          meta_description: string
          meta_keywords: string
          meta_title: string
          og_description: string
          og_image: string
          og_title: string
          og_type: string
          page_name: string
          page_path: string
          robots: string
          structured_data: Json | null
          twitter_card: string
          twitter_description: string
          twitter_title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          canonical_url?: string
          id?: string
          is_enabled?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          og_description?: string
          og_image?: string
          og_title?: string
          og_type?: string
          page_name?: string
          page_path: string
          robots?: string
          structured_data?: Json | null
          twitter_card?: string
          twitter_description?: string
          twitter_title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          canonical_url?: string
          id?: string
          is_enabled?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          og_description?: string
          og_image?: string
          og_title?: string
          og_type?: string
          page_name?: string
          page_path?: string
          robots?: string
          structured_data?: Json | null
          twitter_card?: string
          twitter_description?: string
          twitter_title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          country: string | null
          created_at: string
          id: string
          page_path: string
          referrer: string | null
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      payment_gateways: {
        Row: {
          account_name: string
          account_number: string
          color: string
          created_at: string
          display_order: number
          gateway_id: string
          id: string
          instructions: string
          is_enabled: boolean
          name: string
          updated_at: string
        }
        Insert: {
          account_name?: string
          account_number?: string
          color?: string
          created_at?: string
          display_order?: number
          gateway_id: string
          id?: string
          instructions?: string
          is_enabled?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          account_name?: string
          account_number?: string
          color?: string
          created_at?: string
          display_order?: number
          gateway_id?: string
          id?: string
          instructions?: string
          is_enabled?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          admin_note: string
          amount: number
          billing_period: string
          created_at: string
          id: string
          payment_method: string
          plan_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          sender_number: string
          status: string
          subscription_id: string | null
          transaction_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string
          amount?: number
          billing_period?: string
          created_at?: string
          id?: string
          payment_method?: string
          plan_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          sender_number?: string
          status?: string
          subscription_id?: string | null
          transaction_id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string
          amount?: number
          billing_period?: string
          created_at?: string
          id?: string
          payment_method?: string
          plan_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          sender_number?: string
          status?: string
          subscription_id?: string | null
          transaction_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_tools: {
        Row: {
          created_at: string
          id: string
          min_plan_id: string | null
          tool_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          min_plan_id?: string | null
          tool_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          min_plan_id?: string | null
          tool_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "premium_tools_min_plan_id_fkey"
            columns: ["min_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          badge_text: string
          color: string
          created_at: string
          description: string
          display_order: number
          features: Json
          id: string
          is_enabled: boolean
          is_popular: boolean
          name: string
          price_annual: number
          price_annual_bdt: number
          price_lifetime: number
          price_lifetime_bdt: number
          price_monthly: number
          price_monthly_bdt: number
          price_semi_annual: number
          price_semi_annual_bdt: number
          updated_at: string
        }
        Insert: {
          badge_text?: string
          color?: string
          created_at?: string
          description?: string
          display_order?: number
          features?: Json
          id?: string
          is_enabled?: boolean
          is_popular?: boolean
          name: string
          price_annual?: number
          price_annual_bdt?: number
          price_lifetime?: number
          price_lifetime_bdt?: number
          price_monthly?: number
          price_monthly_bdt?: number
          price_semi_annual?: number
          price_semi_annual_bdt?: number
          updated_at?: string
        }
        Update: {
          badge_text?: string
          color?: string
          created_at?: string
          description?: string
          display_order?: number
          features?: Json
          id?: string
          is_enabled?: boolean
          is_popular?: boolean
          name?: string
          price_annual?: number
          price_annual_bdt?: number
          price_lifetime?: number
          price_lifetime_bdt?: number
          price_monthly?: number
          price_monthly_bdt?: number
          price_semi_annual?: number
          price_semi_annual_bdt?: number
          updated_at?: string
        }
        Relationships: []
      }
      tool_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          tool_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          tool_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          tool_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_ratings_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "custom_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_seo: {
        Row: {
          canonical_url: string
          custom_slug: string
          focus_keyword: string
          id: string
          is_enabled: boolean
          long_description: string
          meta_description: string
          meta_keywords: string
          meta_title: string
          og_description: string
          og_image: string
          og_title: string
          og_type: string
          robots: string
          structured_data: Json | null
          tool_id: string
          twitter_card: string
          twitter_description: string
          twitter_title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          canonical_url?: string
          custom_slug?: string
          focus_keyword?: string
          id?: string
          is_enabled?: boolean
          long_description?: string
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          og_description?: string
          og_image?: string
          og_title?: string
          og_type?: string
          robots?: string
          structured_data?: Json | null
          tool_id: string
          twitter_card?: string
          twitter_description?: string
          twitter_title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          canonical_url?: string
          custom_slug?: string
          focus_keyword?: string
          id?: string
          is_enabled?: boolean
          long_description?: string
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          og_description?: string
          og_image?: string
          og_title?: string
          og_type?: string
          robots?: string
          structured_data?: Json | null
          tool_id?: string
          twitter_card?: string
          twitter_description?: string
          twitter_title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      tool_settings: {
        Row: {
          custom_name: string
          display_order: number | null
          id: string
          is_enabled: boolean
          is_featured: boolean
          tool_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          custom_name?: string
          display_order?: number | null
          id?: string
          is_enabled?: boolean
          is_featured?: boolean
          tool_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          custom_name?: string
          display_order?: number | null
          id?: string
          is_enabled?: boolean
          is_featured?: boolean
          tool_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      totp_secrets: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean
          secret: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_verified?: boolean
          secret: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean
          secret?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          approved_by: string | null
          billing_period: string
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          starts_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_by?: string | null
          billing_period?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          starts_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_by?: string | null
          billing_period?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          starts_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tool_rating: {
        Args: { p_tool_id: string }
        Returns: {
          avg_rating: number
          total_ratings: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_tool_view: { Args: { tool_slug: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
