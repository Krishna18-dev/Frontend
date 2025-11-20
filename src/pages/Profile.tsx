import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, User, Target, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  learning_goals: string[] | null;
  preferences: any;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [learningGoalInput, setLearningGoalInput] = useState("");
  const [learningGoals, setLearningGoals] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      toast.error("Error loading profile");
      console.error(error);
    } else if (data) {
      setProfile(data);
      setFullName(data.full_name || "");
      setLearningGoals(data.learning_goals || []);
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        learning_goals: learningGoals,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Error saving profile");
      console.error(error);
    } else {
      toast.success("Profile updated successfully!");
      fetchProfile();
    }
    setSaving(false);
  };

  const handleAddGoal = () => {
    if (learningGoalInput.trim()) {
      setLearningGoals([...learningGoals, learningGoalInput.trim()]);
      setLearningGoalInput("");
    }
  };

  const handleRemoveGoal = (index: number) => {
    setLearningGoals(learningGoals.filter((_, i) => i !== index));
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Profile Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your learning journey</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Goals
              </CardTitle>
              <CardDescription>Track what you want to achieve</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Add a new goal</Label>
                <div className="flex gap-2">
                  <Input
                    id="goal"
                    value={learningGoalInput}
                    onChange={(e) => setLearningGoalInput(e.target.value)}
                    placeholder="e.g., Master React"
                    onKeyPress={(e) => e.key === "Enter" && handleAddGoal()}
                  />
                  <Button onClick={handleAddGoal}>Add</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Your Goals</Label>
                <div className="flex flex-wrap gap-2">
                  {learningGoals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No goals yet. Add one above!</p>
                  ) : (
                    learningGoals.map((goal, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/20"
                        onClick={() => handleRemoveGoal(index)}
                      >
                        {goal} ×
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Created:</span>
                <span>{profile ? new Date(profile.created_at).toLocaleDateString() : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{profile ? new Date(profile.updated_at).toLocaleDateString() : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID:</span>
                <span className="font-mono text-xs">{user?.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
