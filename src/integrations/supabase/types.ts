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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          read: boolean | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          read?: boolean | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean | null
          subject?: string | null
        }
        Relationships: []
      }
      dog_foods: {
        Row: {
          country_of_origin: string | null
          created_at: string
          dosage_method: string
          energy_content: number | null
          fat_percentage: number | null
          feeding_schedule: string | null
          food_type: string
          id: string
          ingredient_origin: string | null
          ingredients: string | null
          manufacturer: string
          name: string
          notes: string | null
          nutrition_type: string
          price_range: string | null
          product_code: string
          protein_percentage: number | null
          special_features: string[] | null
        }
        Insert: {
          country_of_origin?: string | null
          created_at?: string
          dosage_method: string
          energy_content?: number | null
          fat_percentage?: number | null
          feeding_schedule?: string | null
          food_type: string
          id?: string
          ingredient_origin?: string | null
          ingredients?: string | null
          manufacturer: string
          name: string
          notes?: string | null
          nutrition_type: string
          price_range?: string | null
          product_code: string
          protein_percentage?: number | null
          special_features?: string[] | null
        }
        Update: {
          country_of_origin?: string | null
          created_at?: string
          dosage_method?: string
          energy_content?: number | null
          fat_percentage?: number | null
          feeding_schedule?: string | null
          food_type?: string
          id?: string
          ingredient_origin?: string | null
          ingredients?: string | null
          manufacturer?: string
          name?: string
          notes?: string | null
          nutrition_type?: string
          price_range?: string | null
          product_code?: string
          protein_percentage?: number | null
          special_features?: string[] | null
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
          dog_food_id: string | null
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
          dog_food_id?: string | null
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
          dog_food_id?: string | null
          food_brand?: string | null
          id?: string
          image_path?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_dosage_images_dog_food"
            columns: ["dog_food_id"]
            isOneToOne: false
            referencedRelation: "dog_foods"
            referencedColumns: ["id"]
          },
        ]
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
      food_allergens: {
        Row: {
          allergen_name: string
          allergen_type: string
          created_at: string | null
          dog_food_id: string
          id: string
        }
        Insert: {
          allergen_name: string
          allergen_type: string
          created_at?: string | null
          dog_food_id: string
          id?: string
        }
        Update: {
          allergen_name?: string
          allergen_type?: string
          created_at?: string | null
          dog_food_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_allergens_dog_food_id_fkey"
            columns: ["dog_food_id"]
            isOneToOne: false
            referencedRelation: "dog_foods"
            referencedColumns: ["id"]
          },
        ]
      }
      food_ingredients: {
        Row: {
          created_at: string | null
          dog_food_id: string
          id: string
          ingredient_name: string
          ingredient_type: string
          order_index: number
          percentage: number | null
        }
        Insert: {
          created_at?: string | null
          dog_food_id: string
          id?: string
          ingredient_name: string
          ingredient_type: string
          order_index?: number
          percentage?: number | null
        }
        Update: {
          created_at?: string | null
          dog_food_id?: string
          id?: string
          ingredient_name?: string
          ingredient_type?: string
          order_index?: number
          percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "food_ingredients_dog_food_id_fkey"
            columns: ["dog_food_id"]
            isOneToOne: false
            referencedRelation: "dog_foods"
            referencedColumns: ["id"]
          },
        ]
      }
      food_manufacturers: {
        Row: {
          country_of_origin: string | null
          created_at: string | null
          dog_food_id: string
          feeding_guide_url: string | null
          id: string
          website_url: string | null
        }
        Insert: {
          country_of_origin?: string | null
          created_at?: string | null
          dog_food_id: string
          feeding_guide_url?: string | null
          id?: string
          website_url?: string | null
        }
        Update: {
          country_of_origin?: string | null
          created_at?: string | null
          dog_food_id?: string
          feeding_guide_url?: string | null
          id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_manufacturers_dog_food_id_fkey"
            columns: ["dog_food_id"]
            isOneToOne: true
            referencedRelation: "dog_foods"
            referencedColumns: ["id"]
          },
        ]
      }
      food_nutrition: {
        Row: {
          created_at: string | null
          dog_food_id: string
          fat_percentage: number | null
          fiber_percentage: number | null
          gluten_free: boolean | null
          grain_free: boolean | null
          id: string
          moisture_percentage: number | null
          protein_percentage: number | null
          special_features: string[] | null
          wheat_free: boolean | null
        }
        Insert: {
          created_at?: string | null
          dog_food_id: string
          fat_percentage?: number | null
          fiber_percentage?: number | null
          gluten_free?: boolean | null
          grain_free?: boolean | null
          id?: string
          moisture_percentage?: number | null
          protein_percentage?: number | null
          special_features?: string[] | null
          wheat_free?: boolean | null
        }
        Update: {
          created_at?: string | null
          dog_food_id?: string
          fat_percentage?: number | null
          fiber_percentage?: number | null
          gluten_free?: boolean | null
          grain_free?: boolean | null
          id?: string
          moisture_percentage?: number | null
          protein_percentage?: number | null
          special_features?: string[] | null
          wheat_free?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "food_nutrition_dog_food_id_fkey"
            columns: ["dog_food_id"]
            isOneToOne: true
            referencedRelation: "dog_foods"
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
      friends: {
        Row: {
          activities: string[] | null
          book_id: string
          breed: string | null
          created_at: string
          description: string | null
          friend_type: string
          id: string
          meeting_location: string | null
          name: string
          photos: string[] | null
          updated_at: string
        }
        Insert: {
          activities?: string[] | null
          book_id: string
          breed?: string | null
          created_at?: string
          description?: string | null
          friend_type: string
          id?: string
          meeting_location?: string | null
          name: string
          photos?: string[] | null
          updated_at?: string
        }
        Update: {
          activities?: string[] | null
          book_id?: string
          breed?: string | null
          created_at?: string
          description?: string | null
          friend_type?: string
          id?: string
          meeting_location?: string | null
          name?: string
          photos?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      general_dosage_guidelines: {
        Row: {
          created_at: string
          description: string | null
          food_brand: string | null
          food_name: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          food_brand?: string | null
          food_name?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          food_brand?: string | null
          food_name?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      general_dosage_table_rows: {
        Row: {
          age_range: string | null
          created_at: string
          daily_amount: string | null
          guideline_id: string
          id: string
          notes: string | null
          row_order: number
          weight_range: string | null
        }
        Insert: {
          age_range?: string | null
          created_at?: string
          daily_amount?: string | null
          guideline_id: string
          id?: string
          notes?: string | null
          row_order?: number
          weight_range?: string | null
        }
        Update: {
          age_range?: string | null
          created_at?: string
          daily_amount?: string | null
          guideline_id?: string
          id?: string
          notes?: string | null
          row_order?: number
          weight_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "general_dosage_table_rows_guideline_id_fkey"
            columns: ["guideline_id"]
            isOneToOne: false
            referencedRelation: "general_dosage_guidelines"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_centiles: {
        Row: {
          age_weeks: number
          created_at: string | null
          id: string
          p10: number
          p3: number
          p50: number
          p90: number
          p97: number
          size_class: string
        }
        Insert: {
          age_weeks: number
          created_at?: string | null
          id?: string
          p10: number
          p3: number
          p50: number
          p90: number
          p97: number
          size_class: string
        }
        Update: {
          age_weeks?: number
          created_at?: string | null
          id?: string
          p10?: number
          p3?: number
          p50?: number
          p90?: number
          p97?: number
          size_class?: string
        }
        Relationships: []
      }
      health_records: {
        Row: {
          book_id: string
          created_at: string
          description: string
          dosage: string | null
          dose: string | null
          entry_date: string
          id: string
          lot_number: string | null
          medication_name: string | null
          notes: string | null
          reaction_description: string | null
          reaction_observed: boolean | null
          time: string | null
          type: string
          updated_at: string
          vaccine_brand: string | null
          veterinarian: string | null
          weight_kg: number | null
        }
        Insert: {
          book_id: string
          created_at?: string
          description: string
          dosage?: string | null
          dose?: string | null
          entry_date: string
          id?: string
          lot_number?: string | null
          medication_name?: string | null
          notes?: string | null
          reaction_description?: string | null
          reaction_observed?: boolean | null
          time?: string | null
          type: string
          updated_at?: string
          vaccine_brand?: string | null
          veterinarian?: string | null
          weight_kg?: number | null
        }
        Update: {
          book_id?: string
          created_at?: string
          description?: string
          dosage?: string | null
          dose?: string | null
          entry_date?: string
          id?: string
          lot_number?: string | null
          medication_name?: string | null
          notes?: string | null
          reaction_description?: string | null
          reaction_observed?: boolean | null
          time?: string | null
          type?: string
          updated_at?: string
          vaccine_brand?: string | null
          veterinarian?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      memories: {
        Row: {
          book_id: string
          caption: string | null
          content_type: string
          content_url: string | null
          created_at: string | null
          created_by: string | null
          id: string
          location: Json | null
          privacy_settings: Json | null
          tags: string[] | null
          timeline_entry_id: string | null
          updated_at: string | null
        }
        Insert: {
          book_id: string
          caption?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location?: Json | null
          privacy_settings?: Json | null
          tags?: string[] | null
          timeline_entry_id?: string | null
          updated_at?: string | null
        }
        Update: {
          book_id?: string
          caption?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location?: Json | null
          privacy_settings?: Json | null
          tags?: string[] | null
          timeline_entry_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memories_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "puppy_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_timeline_entry_id_fkey"
            columns: ["timeline_entry_id"]
            isOneToOne: false
            referencedRelation: "timeline_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          memory_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          memory_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          memory_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_comments_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_reactions: {
        Row: {
          created_at: string | null
          id: string
          memory_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          memory_id: string
          reaction_type?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          memory_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_reactions_memory_id_fkey"
            columns: ["memory_id"]
            isOneToOne: false
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          current_step: number | null
          id: string
          step_data: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          step_data?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          step_data?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      puppy_books: {
        Row: {
          birth_date: string | null
          cover_image_url: string | null
          created_at: string | null
          dog_id: string | null
          id: string
          owner_id: string
          privacy_settings: Json | null
          puppy_id: string | null
          theme: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          birth_date?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          dog_id?: string | null
          id?: string
          owner_id: string
          privacy_settings?: Json | null
          puppy_id?: string | null
          theme?: Json | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          birth_date?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          dog_id?: string | null
          id?: string
          owner_id?: string
          privacy_settings?: Json | null
          puppy_id?: string | null
          theme?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "puppy_books_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
      puppy_milestones: {
        Row: {
          book_id: string
          completed: boolean | null
          completed_at: string | null
          completed_by: string | null
          completion_images: string[] | null
          completion_location: Json | null
          completion_notes: string | null
          completion_time: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          month_number: number | null
          target_age_weeks: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          book_id: string
          completed?: boolean | null
          completed_at?: string | null
          completed_by?: string | null
          completion_images?: string[] | null
          completion_location?: Json | null
          completion_notes?: string | null
          completion_time?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          month_number?: number | null
          target_age_weeks?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          book_id?: string
          completed?: boolean | null
          completed_at?: string | null
          completed_by?: string | null
          completion_images?: string[] | null
          completion_location?: Json | null
          completion_notes?: string | null
          completion_time?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          month_number?: number | null
          target_age_weeks?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "puppy_milestones_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "puppy_books"
            referencedColumns: ["id"]
          },
        ]
      }
      socialization_achievements: {
        Row: {
          book_id: string
          category_id: string
          created_at: string
          description: string | null
          earned_at: string
          id: string
          name: string
        }
        Insert: {
          book_id: string
          category_id: string
          created_at?: string
          description?: string | null
          earned_at?: string
          id?: string
          name: string
        }
        Update: {
          book_id?: string
          category_id?: string
          created_at?: string
          description?: string | null
          earned_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      socialization_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      socialization_experiences: {
        Row: {
          book_id: string
          created_at: string | null
          created_by: string | null
          distance_meters: number | null
          duration_minutes: number | null
          experience_date: string
          experience_time: string | null
          id: string
          images: string[] | null
          item_id: string
          notes: string | null
          puppy_reaction: string | null
          rest_after: boolean | null
          treats_given: boolean | null
        }
        Insert: {
          book_id: string
          created_at?: string | null
          created_by?: string | null
          distance_meters?: number | null
          duration_minutes?: number | null
          experience_date: string
          experience_time?: string | null
          id?: string
          images?: string[] | null
          item_id: string
          notes?: string | null
          puppy_reaction?: string | null
          rest_after?: boolean | null
          treats_given?: boolean | null
        }
        Update: {
          book_id?: string
          created_at?: string | null
          created_by?: string | null
          distance_meters?: number | null
          duration_minutes?: number | null
          experience_date?: string
          experience_time?: string | null
          id?: string
          images?: string[] | null
          item_id?: string
          notes?: string | null
          puppy_reaction?: string | null
          rest_after?: boolean | null
          treats_given?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "socialization_experiences_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "puppy_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "socialization_experiences_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "socialization_items"
            referencedColumns: ["id"]
          },
        ]
      }
      socialization_items: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          difficulty_level: number | null
          distance_guidance: string | null
          duration_minutes: number | null
          id: string
          max_age_weeks: number | null
          min_age_weeks: number | null
          name: string
          tips: string[] | null
          why_important: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          distance_guidance?: string | null
          duration_minutes?: number | null
          id?: string
          max_age_weeks?: number | null
          min_age_weeks?: number | null
          name: string
          tips?: string[] | null
          why_important?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          distance_guidance?: string | null
          duration_minutes?: number | null
          id?: string
          max_age_weeks?: number | null
          min_age_weeks?: number | null
          name?: string
          tips?: string[] | null
          why_important?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "socialization_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "socialization_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      socialization_progress: {
        Row: {
          achievements: string[] | null
          book_id: string
          category_id: string
          created_at: string | null
          id: string
          last_activity_date: string | null
          negative_experiences: number | null
          positive_experiences: number | null
          stamp_earned: boolean | null
          stamp_earned_date: string | null
          updated_at: string | null
        }
        Insert: {
          achievements?: string[] | null
          book_id: string
          category_id: string
          created_at?: string | null
          id?: string
          last_activity_date?: string | null
          negative_experiences?: number | null
          positive_experiences?: number | null
          stamp_earned?: boolean | null
          stamp_earned_date?: string | null
          updated_at?: string | null
        }
        Update: {
          achievements?: string[] | null
          book_id?: string
          category_id?: string
          created_at?: string | null
          id?: string
          last_activity_date?: string | null
          negative_experiences?: number | null
          positive_experiences?: number | null
          stamp_earned?: boolean | null
          stamp_earned_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "socialization_progress_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "puppy_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "socialization_progress_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "socialization_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      socialization_weekly_tasks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          item_id: string
          priority: number
          week_number: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          item_id: string
          priority?: number
          week_number: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          item_id?: string
          priority?: number
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "socialization_weekly_tasks_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "socialization_items"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_entries: {
        Row: {
          book_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          entry_date: string
          entry_type: string
          id: string
          is_highlight: boolean | null
          metadata: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          book_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entry_date: string
          entry_type: string
          id?: string
          is_highlight?: boolean | null
          metadata?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          book_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entry_date?: string
          entry_type?: string
          id?: string
          is_highlight?: boolean | null
          metadata?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_entries_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "puppy_books"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vaccination_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          manufacturer: string | null
          name: string
          recommended_age_weeks: number[] | null
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          manufacturer?: string | null
          name: string
          recommended_age_weeks?: number[] | null
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          manufacturer?: string | null
          name?: string
          recommended_age_weeks?: number[] | null
          type?: string
        }
        Relationships: []
      }
      weight_entries: {
        Row: {
          created_at: string | null
          date: string
          dog_id: string | null
          id: string
          user_id: string | null
          weight: number
        }
        Insert: {
          created_at?: string | null
          date: string
          dog_id?: string | null
          id?: string
          user_id?: string | null
          weight: number
        }
        Update: {
          created_at?: string | null
          date?: string
          dog_id?: string | null
          id?: string
          user_id?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_entries_dog_id_fkey"
            columns: ["dog_id"]
            isOneToOne: false
            referencedRelation: "dogs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
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
