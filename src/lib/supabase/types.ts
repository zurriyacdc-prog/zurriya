export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type UserRole = 'parent' | 'therapist' | 'admin';
export type ChildStatus = 'active' | 'on_hold' | 'discharged' | 'archived';
export type GoalType = 'long_term' | 'short_term';
export type SessionType = 'Individual' | 'Group' | 'Home Visit' | 'Assessment';
export type TimelineEventType =
  | 'goal_achieved' | 'new_skill' | 'milestone'
  | 'assessment' | 'new_goal' | 'treatment_plan' | 'intake' | 'note';
export type ReportType = 'progress' | 'assessment' | 'plan' | 'speech' | 'behavior' | 'other';
export type MediaType = 'photo' | 'video';
export type ReinforcerCategory = 'toys' | 'foods' | 'activities' | 'songs';

export type SessionSource = 'portal' | 'cue';

/** Mirrors the goal shapes sent by CUE's /api/sessions/ingest payload (see CUE's TargetDocType.scoringModel). */
export type PortalGoalSummary =
  | { scoringModel: 'percentage'; goalId: string; name: string; baseline: number; current: number; target: number }
  | { scoringModel: 'ladder'; goalId: string; name: string; hierarchyType: 'motor' | 'vocal'; currentPromptLevel: string; independenceScore: number };

export type PortalBehaviorSummaryEntry = { parentFacingLabel: string; count: number };

export type PortalReinforcementSummary = { totalReinforcementEvents: number };

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          name_en: string;
          name_ar: string;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      children: {
        Row: {
          id: string;
          name_en: string;
          name_ar: string;
          age: number;
          diagnosis_en: string;
          diagnosis_ar: string;
          status: ChildStatus;
          avatar_emoji: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['children']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['children']['Insert']>;
      };
      child_relationships: {
        Row: {
          id: string;
          child_id: string;
          parent_id: string | null;
          therapist_id: string | null;
          assigned_at: string;
        };
        Insert: Omit<Database['public']['Tables']['child_relationships']['Row'], 'id' | 'assigned_at'>;
        Update: Partial<Database['public']['Tables']['child_relationships']['Insert']>;
      };
      goals: {
        Row: {
          id: string;
          child_id: string;
          type: GoalType;
          title_en: string;
          title_ar: string;
          domain: string | null;
          color: string;
          progress: number;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['goals']['Insert']>;
      };
      objectives: {
        Row: {
          id: string;
          goal_id: string;
          text_en: string;
          text_ar: string;
          is_done: boolean;
          sort_order: number;
        };
        Insert: Omit<Database['public']['Tables']['objectives']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['objectives']['Insert']>;
      };
      sessions: {
        Row: {
          id: string;
          child_id: string;
          therapist_id: string | null;
          session_date: string;
          type: SessionType | null;
          duration_minutes: number;
          engagement_score: number | null;
          notes_en: string | null;
          notes_ar: string | null;
          created_at: string;
          /** 'portal' = logged by a therapist directly in the Portal; 'cue' = ingested from the CUE app via /api/sessions/ingest. */
          source: SessionSource;
          /** CUE's own session id — unique when set, used to upsert on retried ingest deliveries so they don't duplicate. Null for portal-native rows. */
          external_session_id: string | null;
          /** Free-text therapist name as sent by CUE — there's no matching Zurriya user id for it, unlike therapist_id. Null for portal-native rows. */
          therapist_name: string | null;
          goals: PortalGoalSummary[] | null;
          behavior_summary: PortalBehaviorSummaryEntry[] | null;
          reinforcement_summary: PortalReinforcementSummary | null;
          parent_summary: string | null;
        };
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at' | 'source'> & { source?: SessionSource };
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
      timeline_events: {
        Row: {
          id: string;
          child_id: string;
          type: TimelineEventType;
          title_en: string;
          title_ar: string;
          description_en: string | null;
          description_ar: string | null;
          event_date: string;
          photo_url: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['timeline_events']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['timeline_events']['Insert']>;
      };
      reports: {
        Row: {
          id: string;
          child_id: string;
          uploaded_by: string | null;
          type: ReportType;
          name_en: string;
          name_ar: string;
          file_url: string;
          file_size: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      gallery: {
        Row: {
          id: string;
          child_id: string;
          uploaded_by: string | null;
          media_type: MediaType;
          url: string;
          thumbnail_url: string | null;
          caption_en: string | null;
          caption_ar: string | null;
          taken_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['gallery']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['gallery']['Insert']>;
      };
      reinforcers: {
        Row: {
          id: string;
          child_id: string;
          name_en: string;
          name_ar: string;
          emoji: string;
          category: ReinforcerCategory;
          is_favorite: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reinforcers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reinforcers']['Insert']>;
      };
    };
    Functions: {
      user_role: { Args: Record<never, never>; Returns: UserRole };
      can_access_child: { Args: { p_child_id: string }; Returns: boolean };
    };
  };
}
