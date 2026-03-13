'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Eye, Target, Flag, CircleCheckBig, Loader2 } from 'lucide-react';

interface VisionMissionData {
  vision: string;
  mission: string;
  goals: string | null;
}

export default function VisiMisiContent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VisionMissionData | null>(null);

  useEffect(() => {
    fetchVisionMission();
  }, []);

  const fetchVisionMission = async () => {
    try {
      const response = await fetch('/api/visi-misi');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching vision & mission:', error);
    } finally {
      setLoading(false);
    }
  };

  // Parse mission text into array of items
  const parseMissionItems = (missionText: string) => {
    if (!missionText) return [];
    // Split by numbered list pattern (1., 2., etc.)
    const lines = missionText.split('\n').filter(line => line.trim());
    return lines.map(line => {
      // Remove leading numbers and dots
      return line.replace(/^\d+\.\s*/, '').trim();
    }).filter(line => line.length > 0);
  };

  // Parse goals text into array of items
  const parseGoalsItems = (goalsText: string | null) => {
    if (!goalsText) return [];
    const lines = goalsText.split('\n').filter(line => line.trim());
    return lines.map(line => {
      // Remove leading dashes or bullets
      return line.replace(/^[-•]\s*/, '').trim();
    }).filter(line => line.length > 0);
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  const missionItems = data ? parseMissionItems(data.mission) : [];
  const goalItems = data?.goals ? parseGoalsItems(data.goals) : [];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Visi Card */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-display font-bold">Visi</h2>
          </div>
          <p className="text-xl leading-relaxed">
            {data?.vision || 'Visi belum diatur'}
          </p>
        </div>

        {/* Misi Card */}
        <Card className="bg-card rounded-2xl p-8 shadow-card border border-border mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Misi</h2>
          </div>
          {missionItems.length > 0 ? (
            <ul className="space-y-4">
              {missionItems.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#D9F3FC] text-[#0D93F2] flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground pt-1">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Misi belum diatur</p>
          )}
        </Card>

        {/* Tujuan Card */}
        {goalItems.length > 0 && (
          <Card className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flag className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">Tujuan</h2>
            </div>
            <ul className="space-y-4">
              {goalItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CircleCheckBig className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

      </div>
    </section>
  );
}
