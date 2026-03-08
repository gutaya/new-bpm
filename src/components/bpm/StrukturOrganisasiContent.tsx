'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface OrganizationMember {
  name: string;
  position: string;
  photoUrl: string | null;
}

interface OrganizationData {
  kepala: OrganizationMember | null;
  coordinators: OrganizationMember[];
  sekretaris: OrganizationMember | null;
}

const defaultOrganizationData: OrganizationData = {
  kepala: {
    name: 'Dr. Ir. Dwi Ernaningsih, M.Si.',
    position: 'Kepala Badan Penjaminan Mutu',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  },
  coordinators: [
    {
      name: 'Dr. Achmad Budiman Soedarsono, S.Sos., M.I.Kom.',
      position: 'Koordinator Bidang Perencanaan dan Pengembangan',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    },
    {
      name: 'Tagor Darius Sidauruk, SE, M.Si., CRP',
      position: 'Koordinator Bagian Monitoring dan Evaluasi',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
  ],
  sekretaris: {
    name: 'Imaniah Aliati, S.Kom',
    position: 'Sekretaris',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  },
};

export default function StrukturOrganisasiContent() {
  const [organizationData, setOrganizationData] = useState<OrganizationData>(defaultOrganizationData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/struktur-organisasi')
      .then((res) => res.json())
      .then((data: OrganizationData) => {
        if (data && (data.kepala || data.coordinators?.length > 0 || data.sekretaris)) {
          setOrganizationData({
            kepala: data.kepala || defaultOrganizationData.kepala,
            coordinators: data.coordinators?.length > 0 ? data.coordinators : defaultOrganizationData.coordinators,
            sekretaris: data.sekretaris || defaultOrganizationData.sekretaris,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching organization structure:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-8 sm:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <Card className="bg-card rounded-2xl p-4 sm:p-8 shadow-card border border-border">
          
          {/* Main Tree Container */}
          <div className="flex flex-col items-center w-full relative">
            
            {/* Vertical center line - from Kepala through to Sekretaris */}
            <div className="hidden md:block absolute left-1/2 w-0.5 bg-primary/40 -translate-x-1/2 z-0" style={{ top: '0', height: 'calc(100% - 100px)' }}></div>
            
            {/* Kepala BPM */}
            {organizationData.kepala && (
              <div className="bg-primary text-primary-foreground rounded-xl p-4 sm:p-6 text-center w-full max-w-[320px] z-10">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-primary-foreground/20 bg-primary-foreground/20">
                  {organizationData.kepala.photoUrl ? (
                    <img
                      src={organizationData.kepala.photoUrl}
                      alt={organizationData.kepala.name}
                      className="aspect-square h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 mx-auto text-primary-foreground/50" />
                  )}
                </div>
                <h3 className="font-display font-semibold text-sm sm:text-base">
                  {organizationData.kepala.position}
                </h3>
                <p className="text-xs sm:text-sm text-primary-foreground/80 mt-1">
                  {organizationData.kepala.name}
                </p>
              </div>
            )}

            {/* Vertical line from Kepala */}
            <div className="w-0.5 h-6 sm:h-10 bg-primary/40 md:opacity-0 z-10"></div>

            {/* Mobile: Coordinators stacked vertically */}
            <div className="flex flex-col items-center gap-0 w-full md:hidden">
              {organizationData.coordinators.map((coord, index) => (
                <div key={index} className="flex flex-col items-center w-full max-w-[260px]">
                  {index > 0 && <div className="w-0.5 h-6 bg-primary/40"></div>}
                  <div className="bg-muted rounded-xl p-4 text-center w-full">
                    <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-primary/10 bg-muted">
                      {coord.photoUrl ? (
                        <img
                          src={coord.photoUrl}
                          alt={coord.name}
                          className="aspect-square h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 mx-auto text-muted-foreground/50" />
                      )}
                    </div>
                    <h4 className="font-semibold text-xs text-foreground mb-1">
                      {coord.position}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {coord.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Coordinators side by side with connecting lines */}
            <div className="hidden md:block w-full max-w-5xl relative">
              <div className="relative">
                {/* Horizontal line connecting coordinators at top */}
                <div className="absolute h-0.5 bg-primary/40" style={{ top: 0, left: 'calc(25% - 2.25rem)', right: 'calc(25% - 2.25rem)' }}></div>
                
                {/* Coordinators row */}
                <div className="flex justify-center items-start w-full gap-36">
                  {organizationData.coordinators.map((coord, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="flex flex-col items-center w-full px-2">
                        <div className="w-0.5 h-10 bg-primary/40"></div>
                        <div className="bg-muted rounded-xl p-4 text-center w-full">
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-primary/10 bg-muted">
                            {coord.photoUrl ? (
                              <img
                                src={coord.photoUrl}
                                alt={coord.name}
                                className="aspect-square h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-12 w-12 mx-auto text-muted-foreground/50" />
                            )}
                          </div>
                          <h4 className="font-semibold text-sm text-foreground mb-1">
                            {coord.position}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {coord.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sekretaris section with connecting lines */}
              {organizationData.sekretaris && (
                <div className="relative w-full flex justify-center" style={{ marginTop: '80px' }}>
                  {/* Left vertical line from bottom of Coord 1 box to horizontal line */}
                  <div className="hidden md:block absolute w-0.5 bg-primary/40" style={{ left: 'calc(25% - 2.25rem)', top: '-80px', height: 'calc(50% + 80px)' }}></div>
                  
                  {/* Left horizontal line to center - BEHIND Sekretaris box */}
                  <div className="hidden md:block absolute h-0.5 bg-primary/40 z-0" style={{ top: '50%', left: 'calc(25% - 2.25rem)', right: 'calc(50% - 130px)' }}></div>
                  
                  {/* Right vertical line from bottom of Coord 2 box to horizontal line */}
                  <div className="hidden md:block absolute w-0.5 bg-primary/40" style={{ right: 'calc(25% - 2.25rem)', top: '-80px', height: 'calc(50% + 80px)' }}></div>
                  
                  {/* Right horizontal line to center - BEHIND Sekretaris box */}
                  <div className="hidden md:block absolute h-0.5 bg-primary/40 z-0" style={{ top: '50%', left: 'calc(50% + 130px)', right: 'calc(25% - 2.25rem)' }}></div>
                  
                  {/* Sekretaris card - HIGHER z-index to be in front of lines */}
                  <div className="w-full max-w-[260px] z-10 relative">
                    <div className="bg-secondary rounded-xl p-4 sm:p-5 text-center">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-primary/10 bg-muted">
                        {organizationData.sekretaris.photoUrl ? (
                          <img
                            src={organizationData.sekretaris.photoUrl}
                            alt={organizationData.sekretaris.name}
                            className="aspect-square h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-12 w-12 mx-auto text-muted-foreground/50" />
                        )}
                      </div>
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground mb-1">
                        {organizationData.sekretaris.position}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        {organizationData.sekretaris.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: Sekretaris */}
            {organizationData.sekretaris && (
              <div className="flex flex-col items-center w-full z-10 md:hidden">
                <div className="w-0.5 h-6 bg-primary/40"></div>
                <div className="w-full max-w-[260px]">
                  <div className="bg-secondary rounded-xl p-4 sm:p-5 text-center">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-primary/10 bg-muted">
                      {organizationData.sekretaris.photoUrl ? (
                        <img
                          src={organizationData.sekretaris.photoUrl}
                          alt={organizationData.sekretaris.name}
                          className="aspect-square h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      )}
                    </div>
                    <h4 className="font-semibold text-xs sm:text-sm text-foreground mb-1">
                      {organizationData.sekretaris.position}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      {organizationData.sekretaris.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </Card>
      </div>
    </section>
  );
}
