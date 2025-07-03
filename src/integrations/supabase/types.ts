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
      dog_foods: {
        Row: {
          created_at: string
          dosage_method: string
          food_type: string
          id: string
          manufacturer: string
          name: string
          notes: string | null
          nutrition_type: string
          product_code: string
        }
        Insert: {
          created_at?: string
          dosage_method: string
          food_type: string
          id?: string
          manufacturer: string
          name: string
          notes?: string | null
          nutrition_type: string
          product_code: string
        }
        Update: {
          created_at?: string
          dosage_method?: string
          food_type?: string
          id?: string
          manufacturer?: string
          name?: string
          notes?: string | null
          nutrition_type?: string
          product_code?: string
        }
        Relationships: []
      }
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
      dosage_images: {
        Row: {
          created_at: string
          description: string | null
          food_brand: string | null
          id: string
          image_path: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          food_brand?: string | null
          id?: string
          image_path: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          food_brand?: string | null
          id?: string
          image_path?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dosage_table_data: {
        Row: {
          age_range: string | null
          created_at: string
          daily_amount: string | null
          dosage_image_id: string
          id: string
          notes: string | null
          row_order: number
          weight_range: string | null
        }
        Insert: {
          age_range?: string | null
          created_at?: string
          daily_amount?: string | null
          dosage_image_id: string
          id?: string
          notes?: string | null
          row_order?: number
          weight_range?: string | null
        }
        Update: {
          age_range?: string | null
          created_at?: string
          daily_amount?: string | null
          dosage_image_id?: string
          id?: string
          notes?: string | null
          row_order?: number
          weight_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dosage_table_data_dosage_image_id_fkey"
            columns: ["dosage_image_id"]
            isOneToOne: false
            referencedRelation: "dosage_images"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_guidelines: {
        Row: {
          adult_weight_kg: number | null
          age_months: string | null
          calculation_formula: string | null
          created_at: string
          current_weight_kg: number | null
          daily_amount_max: number | null
          daily_amount_min: number | null
          dog_food_id: string
          id: string
          size_category: string | null
        }
        Insert: {
          adult_weight_kg?: number | null
          age_months?: string | null
          calculation_formula?: string | null
          created_at?: string
          current_weight_kg?: number | null
          daily_amount_max?: number | null
          daily_amount_min?: number | null
          dog_food_id: string
          id?: string
          size_category?: string | null
        }
        Update: {
          adult_weight_kg?: number | null
          age_months?: string | null
          calculation_formula?: string | null
          created_at?: string
          current_weight_kg?: number | null
          daily_amount_max?: number | null
          daily_amount_min?: number | null
          dog_food_id?: string
          id?: string
          size_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feeding_guidelines_dog_food_id_fkey"
            columns: ["dog_food_id"]
            isOneToOne: false
            referencedRelation: "dog_foods"
            referencedColumns: ["id"]
          },
        ]
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
