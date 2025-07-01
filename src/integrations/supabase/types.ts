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
      dogs: {
        Row: {
          activity_level: string | null
          age_years: number | null
          breed: string | null
          created_at: string
          health_conditions: string[] | null
          id: string
          name: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          age_years?: number | null
          breed?: string | null
          created_at?: string
          health_conditions?: string[] | null
          id?: string
          name: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          age_years?: number | null
          breed?: string | null
          created_at?: string
          health_conditions?: string[] | null
          id?: string
          name?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      feeding_plans: {
        Row: {
          created_at: string
          daily_amount_grams: number
          dog_id: string
          id: string
          meals_per_day: number
          notes: string | null
          recipe_id: string
        }
        Insert: {
          created_at?: string
          daily_amount_grams: number
          dog_id: string
          id?: string
          meals_per_day?: number
          notes?: string | null
          recipe_id: string
        }
        Update: {
          created_at?: string
          daily_amount_grams?: number
          dog_id?: string
          id?: string
          meals_per_day?: number
          notes?: string | null
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeding_plans_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeding_plans_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      food_recipes: {
        Row: {
          brand: string | null
          calories_per_100g: number | null
          carb_percentage: number | null
          created_at: string
          fat_percentage: number | null
          feeding_instructions: Json | null
          id: string
          image_url: string | null
          name: string
          protein_percentage: number | null
          source: string | null
        }
        Insert: {
          brand?: string | null
          calories_per_100g?: number | null
          carb_percentage?: number | null
          created_at?: string
          fat_percentage?: number | null
          feeding_instructions?: Json | null
          id?: string
          image_url?: string | null
          name: string
          protein_percentage?: number | null
          source?: string | null
        }
        Update: {
          brand?: string | null
          calories_per_100g?: number | null
          carb_percentage?: number | null
          created_at?: string
          fat_percentage?: number | null
          feeding_instructions?: Json | null
          id?: string
          image_url?: string | null
          name?: string
          protein_percentage?: number | null
          source?: string | null
        }
        Relationships: []
      }
      weight_entries: {
        Row: {
          created_at: string | null
          date: string
          id: string
          user_id: string | null
          weight: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          user_id?: string | null
          weight: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          user_id?: string | null
          weight?: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
