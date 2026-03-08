'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface AccreditationData {
  id: string;
  name: string;
  category: string;
  count: number;
  programs: string;
  color: string;
}

const accreditationColors: Record<string, { gradient: string; bg: string }> = {
  'BAN-PT': { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500' },
  'LAM TEKNIK': { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500' },
  'LAM INFOKOM': { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-500' },
  'LAMEMBA': { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-500' },
  'LAMSPAK': { gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-500' },
};

export default function AccreditationSection() {
  const [accreditations, setAccreditations] = useState<AccreditationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/accreditations/chart')
      .then((res) => res.json())
      .then((data) => {
        setAccreditations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching accreditations:', error);
        setLoading(false);
      });
  }, []);

  // Group accreditations by name
  const groupedAccreditations: Record<string, AccreditationData[]> = {};
  accreditations.forEach((item) => {
    if (!groupedAccreditations[item.name]) {
      groupedAccreditations[item.name] = [];
    }
    groupedAccreditations[item.name].push(item);
  });

  const totalPrograms = accreditations.reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-secondary/30 via-background to-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-muted-foreground">Memuat data akreditasi...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="akreditasi" className="py-20 bg-gradient-to-br from-secondary/30 via-background to-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[#0D93F2] font-semibold text-sm uppercase tracking-wider mb-2">
            <Award className="h-4 w-4" />
            Capaian Mutu
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2 mb-4">
            Status Akreditasi Program Studi
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Total <span className="font-semibold text-foreground">{totalPrograms}</span> Program Studi terakreditasi dari berbagai lembaga akreditasi
          </p>
        </div>

        {/* Accreditation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(groupedAccreditations).map(([name, items]) => {
            const colors = accreditationColors[name] || accreditationColors['BAN-PT'];
            const totalItems = items.reduce((sum, item) => sum + item.count, 0);
            const hoveredData = items.find(item => item.id === hoveredItem);

            return (
              <div key={name} className="group">
                <Card className="bg-card rounded-2xl shadow-card border border-border transition-all duration-300 h-full hover:shadow-card-hover">
                  <CardContent className="p-6">
                    {/* Header with gradient */}
                    <div className={`bg-gradient-to-r ${colors.gradient} rounded-xl p-3 mb-4 -mx-2 -mt-2`}>
                      <h3 className="text-lg font-display font-semibold text-white text-center">{name}</h3>
                    </div>

                    {/* Pie Chart */}
                    <div className="h-48 flex items-center justify-center relative">
                      <div className="relative w-40 h-40">
                        <svg 
                          viewBox="0 0 200 200" 
                          className="w-full h-full transform -rotate-90"
                          style={{ overflow: 'visible' }}
                        >
                          {items.map((item, index) => {
                            const prevItems = items.slice(0, index);
                            const prevTotal = prevItems.reduce((sum, i) => sum + i.count, 0);
                            const percentage = totalItems > 0 ? (item.count / totalItems) * 100 : 0;
                            const prevPercentage = totalItems > 0 ? (prevTotal / totalItems) * 100 : 0;
                            const isHovered = hoveredItem === item.id;
                            const hasHovered = hoveredItem !== null;
                            
                            // Calculate stroke dasharray for donut chart
                            const circumference = 2 * Math.PI * 70;
                            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = -((prevPercentage / 100) * circumference);
                            
                            return (
                              <g key={item.id}>
                                {/* Invisible larger hit area for easier hovering */}
                                <circle
                                  cx="100"
                                  cy="100"
                                  r="75"
                                  fill="transparent"
                                  stroke="transparent"
                                  strokeWidth="50"
                                  strokeDasharray={strokeDasharray}
                                  strokeDashoffset={strokeDashoffset}
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredItem(item.id)}
                                  onMouseLeave={() => setHoveredItem(null)}
                                />
                                {/* Visible pie segment */}
                                <circle
                                  cx="100"
                                  cy="100"
                                  r={isHovered ? "75" : "70"}
                                  fill="transparent"
                                  stroke={item.color}
                                  strokeWidth={isHovered ? "28" : "24"}
                                  strokeDasharray={strokeDasharray}
                                  strokeDashoffset={strokeDashoffset}
                                  className="transition-all duration-300 pointer-events-none"
                                  style={{
                                    opacity: hasHovered && !isHovered ? 0.3 : 1,
                                    filter: isHovered ? 'brightness(1.1) drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none',
                                  }}
                                />
                              </g>
                            );
                          })}
                        </svg>
                        
                        {/* Center Display */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none">
                          {hoveredData ? (
                            <div className="text-center animate-in fade-in zoom-in duration-200">
                              <span className="text-4xl font-bold text-foreground">{hoveredData.count}</span>
                              <p className="text-sm text-muted-foreground mt-1 font-medium">{hoveredData.category}</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <span className="text-4xl font-bold text-foreground">{totalItems}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Tooltip */}
                      {hoveredData && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium shadow-lg z-10 animate-in fade-in slide-in-from-bottom-2 duration-200 whitespace-nowrap">
                          Status {hoveredData.category}: {hoveredData.count} Program Studi
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rotate-45" />
                        </div>
                      )}
                    </div>

                    {/* Legend */}
                    <div className="space-y-3 mt-4">
                      {items.map((item) => {
                        let programs: string[] = [];
                        try {
                          programs = item.programs ? JSON.parse(item.programs) : [];
                        } catch {
                          programs = [];
                        }
                        const isHovered = hoveredItem === item.id;
                        
                        return (
                          <div 
                            key={item.id} 
                            className={`space-y-1 transition-all duration-300 rounded-lg p-1.5 -m-1.5 ${isHovered ? 'bg-secondary/70' : ''}`}
                          >
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300 ${isHovered ? 'scale-125 ring-2 ring-offset-1 ring-offset-background' : ''}`}
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="font-medium text-foreground">
                                  {item.category}
                                </span>
                              </div>
                              <span className={`font-bold transition-all duration-300 ${isHovered ? 'text-primary text-lg' : 'text-foreground'}`}>
                                {item.count}
                              </span>
                            </div>
                            <div className={`pl-5 space-y-0.5 overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-40 opacity-100' : 'max-h-20 opacity-70'}`}>
                              {programs.map((program, idx) => (
                                <p key={idx} className="text-xs text-muted-foreground truncate">
                                  • {program}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {/* Empty LAMSPAK Card - only show if no data */}
          {!groupedAccreditations['LAMSPAK'] && (
            <div className="group">
              <Card className="bg-card rounded-2xl shadow-card border border-border transition-all duration-300 h-full opacity-50">
                <CardContent className="p-6">
                  <div className={`bg-gradient-to-r ${accreditationColors['LAMSPAK'].gradient} rounded-xl p-3 mb-4 -mx-2 -mt-2`}>
                    <h3 className="text-lg font-display font-semibold text-white text-center">LAMSPAK</h3>
                  </div>
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm text-center">Belum ada data</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
