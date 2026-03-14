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
      migration_tasks: {
        Row: {
          assignee: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string
          end_date: string | null
          id: string
          input_type: string
          migration_id: string
          milestone: string
          order: number
          remarks: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          end_date?: string | null
          id?: string
          input_type?: string
          migration_id: string
          milestone: string
          order?: number
          remarks?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          end_date?: string | null
          id?: string
          input_type?: string
          migration_id?: string
          milestone?: string
          order?: number
          remarks?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "migration_tasks_migration_id_fkey"
            columns: ["migration_id"]
            isOneToOne: false
            referencedRelation: "migrations"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          ap_manager: string
          ap_sponsor: string
          completion_percent: number
          created_at: string
          d_minus_1m: string
          d_minus_2m: string
          d_minus_3m: string
          db_type: string
          dba: string
          dbid: string
          id: string
          migration_date: string
          migration_strategy: string | null
          overall_status: string
          phase: string
          prod_or_test: string
          remarks: string | null
          source_db_type: string | null
          task_owner: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          ap_manager?: string
          ap_sponsor?: string
          completion_percent?: number
          created_at?: string
          d_minus_1m?: string
          d_minus_2m?: string
          d_minus_3m?: string
          db_type: string
          dba: string
          dbid: string
          id?: string
          migration_date: string
          migration_strategy?: string | null
          overall_status?: string
          phase: string
          prod_or_test?: string
          remarks?: string | null
          source_db_type?: string | null
          task_owner?: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          ap_manager?: string
          ap_sponsor?: string
          completion_percent?: number
          created_at?: string
          d_minus_1m?: string
          d_minus_2m?: string
          d_minus_3m?: string
          db_type?: string
          dba?: string
          dbid?: string
          id?: string
          migration_date?: string
          migration_strategy?: string | null
          overall_status?: string
          phase?: string
          prod_or_test?: string
          remarks?: string | null
          source_db_type?: string | null
          task_owner?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "migrations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
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
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_notes: {
        Row: {
          author: string
          content: string
          created_at: string
          id: string
          task_id: string
        }
        Insert: {
          author?: string
          content?: string
          created_at?: string
          id?: string
          task_id: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_notes_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "migration_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      template_milestone_offsets: {
        Row: {
          created_at: string
          id: string
          milestone: string
          offset_months: number
          template_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          milestone: string
          offset_months?: number
          template_id: string
        }
        Update: {
          created_at?: string
          id?: string
          milestone?: string
          offset_months?: number
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_milestone_offsets_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      template_tasks: {
        Row: {
          assignee: string
          created_at: string
          id: string
          input_type: string
          milestone: string
          order: number
          remarks: string | null
          template_id: string
          title: string
        }
        Insert: {
          assignee?: string
          created_at?: string
          id?: string
          input_type?: string
          milestone: string
          order?: number
          remarks?: string | null
          template_id: string
          title?: string
        }
        Update: {
          assignee?: string
          created_at?: string
          id?: string
          input_type?: string
          milestone?: string
          order?: number
          remarks?: string | null
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "dba" | "user"
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
      app_role: ["admin", "dba", "user"],
    },
  },
} as const
