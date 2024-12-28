'use client'

import { useTranslations } from 'next-intl';
import { Link } from '@src/i18n/routing';
import { useState, useEffect } from 'react';
import { TournamentModel, defaultTournament } from '@/data-models/tournament.model';
import { FormatModel, defaultFormat } from '@/data-models/format.model';
import { TournamentCreationStep } from '@/enums/tournament.enum';
import { ServiceFactory } from '@/services/service.factory';
import { NotificationService } from '@/services/notification/notification.service';
import { ErrorService } from '@/services/error/error.service';
import { useRouter } from 'next/navigation';
import { formatDateForInput, formatDateForServer } from '@/utils/date.utils';
import FormatForm from '../../components/FormatForm';
import StepsBar from '../../components/StepsBar';
import GroupTeamForm from '../../components/GroupTeamForm';
import { motion, AnimatePresence } from 'framer-motion';
import TournamentInfoForm from '../../components/TournamentInfoForm';
import { GroupModel, TeamModel } from '@/data-models/tournament.model';

interface PageProps {
  tournamentId?: number;  // Optional ID for editing existing tournament
}

const RequiredLabel: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center">
    <span className="block text-sm font-medium text-gray-700">{text}</span>
    <span className="text-red-500 ml-1">*</span>
  </div>
);

export default function NewTournamentPage({ tournamentId }: PageProps) {
  const t = useTranslations('NewTournament');
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(TournamentCreationStep.TOURNAMENT_INFO);
  const [tournament, setTournament] = useState<TournamentModel>(defaultTournament);
  const [formats, setFormats] = useState<FormatModel[]>([{ ...defaultFormat }]);
  const [groups, setGroups] = useState<GroupModel[]>([]);
  const [teams, setTeams] = useState<TeamModel[]>([]);

  // Fetch existing data if editing
  useEffect(() => {
    const fetchTournament = async () => {
      if (tournamentId) {
        try {
          const tournamentService = ServiceFactory.getTournamentService();
          const data = await tournamentService.getTournament(tournamentId);
          setTournament(data);
          setFormats(data.formats || [{ ...defaultFormat }]);
          setGroups(data.groups || []);
          setTeams(data.teams || []);
        } catch (error) {
          NotificationService.error(ErrorService.handle(error));
        }
      }
    };

    fetchTournament();
  }, [tournamentId]);

  const handleTournamentChange = (field: string, value: string) => {
    setTournament(prev => ({
      ...prev,
      [field]: field.includes('Date') ? formatDateForServer(value) : value
    }));
  };

  const handleFormatUpdate = (index: number, updatedFormat: FormatModel) => {
    setFormats(prev => {
      const newFormats = [...prev];
      newFormats[index] = updatedFormat;
      return newFormats;
    });
  };

  const handleGroupsUpdate = (newGroups: any[]) => {  // Replace 'any' with your group type
    setGroups(newGroups);
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tournamentService = ServiceFactory.getTournamentService();
      
      await NotificationService.promise(
        tournamentService.saveTournament({
          tournament,
          formats,
          groups,
          teams
        }),
        {
          loading: t('notifications.saving'),
          success: t('notifications.saved'),
          error: (err) => ErrorService.handle(err),
        }
      );

      // router.push('/tournaments');
    } catch (error) {
      if (!ErrorService.isHttpError(error)) {
        NotificationService.error(ErrorService.handle(error));
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case TournamentCreationStep.TOURNAMENT_INFO:
        return (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
          >
            <TournamentInfoForm 
              tournament={tournament}
              onUpdate={handleTournamentChange}
            />
          </motion.div>
        );

      case TournamentCreationStep.FORMATS:
        return (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
          >
            {/* Formats Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center text-[#39846d]">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </span>
                {t('formats.title')}
              </h2>

              <div className="space-y-4">
                {formats.map((format, index) => (
                  <FormatForm
                    key={index}
                    format={format}
                    onUpdate={(updatedFormat) => handleFormatUpdate(index, updatedFormat)}
                    onRemove={() => {/* ... */}}
                    showRemoveButton={formats.length > 1}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );

      case TournamentCreationStep.GROUPS_AND_TEAMS:
        return (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
          >
            {formats.map((format, index) => (
              <GroupTeamForm
                key={index}
                format={format}
                onUpdate={(updatedGroups) => handleGroupsUpdate(updatedGroups)}
              />
            ))}
          </motion.div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#39846d] text-white px-8 py-6">
            <h1 className="text-3xl font-bold text-center">{t('title')}</h1>
          </div>

          <div className="p-8">
            <StepsBar currentStep={currentStep} />

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {currentStep > TournamentCreationStep.TOURNAMENT_INFO && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-3 px-4 hover:bg-gray-200 transition-colors duration-200 font-medium text-lg"
                  >
                    {t('back')}
                  </button>
                )}

                {currentStep < TournamentCreationStep.GROUPS_AND_TEAMS ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-[#39846d] text-white rounded-lg py-3 px-4 hover:bg-[#2c6353] transition-colors duration-200 font-medium text-lg"
                  >
                    {t('next')}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 bg-[#39846d] text-white rounded-lg py-3 px-4 hover:bg-[#2c6353] transition-colors duration-200 font-medium text-lg"
                  >
                    {t('finish')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 