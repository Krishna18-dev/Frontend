-- Create user statistics table
CREATE TABLE public.user_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  study_time_minutes integer DEFAULT 0,
  courses_completed integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  points integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create saved content table
CREATE TABLE public.saved_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL,
  topic text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create interview sessions table
CREATE TABLE public.interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL,
  difficulty text NOT NULL,
  questions jsonb NOT NULL,
  answers jsonb NOT NULL,
  feedback jsonb,
  score integer,
  completed_at timestamp with time zone DEFAULT now()
);

-- Create game progress table
CREATE TABLE public.game_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_type text NOT NULL,
  score integer NOT NULL,
  difficulty text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  played_at timestamp with time zone DEFAULT now()
);

-- Create study reminders table
CREATE TABLE public.study_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  reminder_date date NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_statistics
CREATE POLICY "Users can view their own statistics"
  ON public.user_statistics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own statistics"
  ON public.user_statistics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own statistics"
  ON public.user_statistics FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for achievements (public read)
CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for saved_content
CREATE POLICY "Users can view their own content"
  ON public.saved_content FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content"
  ON public.saved_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content"
  ON public.saved_content FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for interview_sessions
CREATE POLICY "Users can view their own sessions"
  ON public.interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON public.interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for game_progress
CREATE POLICY "Users can view their own progress"
  ON public.game_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.game_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for study_reminders
CREATE POLICY "Users can manage their own reminders"
  ON public.study_reminders FOR ALL
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_user_statistics_updated_at
  BEFORE UPDATE ON public.user_statistics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert some default achievements
INSERT INTO public.achievements (name, description, icon, category, points) VALUES
  ('First Steps', 'Complete your first study session', 'Award', 'learning', 10),
  ('Content Creator', 'Generate your first study content', 'FileText', 'content', 15),
  ('Interview Ready', 'Complete your first mock interview', 'Briefcase', 'interview', 20),
  ('Game Master', 'Score 100% on a learning game', 'Trophy', 'games', 25),
  ('Week Warrior', 'Study for 7 consecutive days', 'Calendar', 'streak', 30),
  ('Knowledge Seeker', 'Generate 10 pieces of content', 'Book', 'content', 50),
  ('Interview Expert', 'Complete 5 mock interviews', 'Star', 'interview', 50);

-- Function to update or insert daily statistics
CREATE OR REPLACE FUNCTION public.upsert_daily_stats(
  p_user_id uuid,
  p_study_minutes integer DEFAULT 0,
  p_courses integer DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_statistics (user_id, date, study_time_minutes, courses_completed)
  VALUES (p_user_id, CURRENT_DATE, p_study_minutes, p_courses)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    study_time_minutes = user_statistics.study_time_minutes + EXCLUDED.study_time_minutes,
    courses_completed = user_statistics.courses_completed + EXCLUDED.courses_completed,
    updated_at = now();
END;
$$;