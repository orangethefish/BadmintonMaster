'use client'

import { useTranslations } from 'next-intl';
import { Link } from '@src/i18n/routing';
import { useState, useEffect } from 'react';
import { TournamentModel, defaultTournament } from '@/data-models/tournament.model';
import { FormatModel, defaultFormat } from '@/data-models/format.model';
import { TournamentCreationStep, FormatType } from '@/enums/tournament.enum';
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
import { GroupModel } from '@/data-models/group.model';
import { TeamModel } from '@/data-models/team.model';


const RequiredLabel: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center">
    <span className="block text-sm font-medium text-gray-700">{text}</span>
    <span className="text-red-500 ml-1">*</span>
  </div>
);

export default function NewTournamentPage() {
  const t = useTranslations('NewTournament');
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(TournamentCreationStep.TOURNAMENT_INFO);
  const [tournament, setTournament] = useState<TournamentModel>(defaultTournament);
  const [formats, setFormats] = useState<FormatModel[]>([{ ...defaultFormat }]);
  const [groups, setGroups] = useState<GroupModel[]>([]);
  const [teams, setTeams] = useState<TeamModel[]>([]);


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

  const isTournamentInfoValid = () => {
    return tournament.name.trim() !== '' && 
           tournament.startDate !== '' && 
           tournament.endDate !== '';
  };

  const isFormatsValid = () => {
    return formats.every(format => 
      format.numOfGroups > 0 &&
      format.groupScore > 0 &&
      format.groupMaxScore > 0 &&
      format.playOffScore > 0 &&
      format.playOffMaxScore > 0
    );
  };

  const isGroupsAndTeamsValid = () => {
    return groups.every(group => 
      group.groupName.trim() !== '' &&
      group.numOfTeams > 0 &&
      teams.filter(team => team.groupId === group.groupId)
           .every(team => team.player1Name.trim() !== '' && 
                  (isDoubleFormat(group.formatId) ? team.player2Name?.trim() !== '' : true))
    );
  };

  const isDoubleFormat = (formatId: number) => {
    const format = formats.find(f => f.formatId === formatId);
    return format?.formatType === FormatType.MEN_DOUBLES || 
           format?.formatType === FormatType.WOMEN_DOUBLES || 
           format?.formatType === FormatType.MIXED_DOUBLES;
  };

  const handleSubmitTournamentInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isTournamentInfoValid()) {
      NotificationService.error(t('errors.requiredFields'));
      return;
    }

    handleNext();
  };

  const handleSubmitFormats = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormatsValid()) {
      NotificationService.error(t('errors.requiredFields'));
      return;
    }

    try {
      const tournamentService = ServiceFactory.getTournamentService();
      const response = await NotificationService.promise(
        tournamentService.saveTournament({
          tournament,
          formats,
        }),
        {
          loading: t('notifications.saving'),
          success: t('notifications.saved'),
          error: t('notifications.error'),
        }
      );

      if (response) {
        if (response.tournament) {
          setTournament(response.tournament);
        }
        if (response.formats) {
          setFormats(response.formats);
        }
        handleNext();
      }
    } catch (error) {
      if (!ErrorService.isHttpError(error)) {
        NotificationService.error(ErrorService.handle(error));
      }
    }
  };

  const handleSubmitGroupAndTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isGroupsAndTeamsValid()) {
      NotificationService.error(t('errors.requiredFields'));
      return;
    }

    try {
      const tournamentService = ServiceFactory.getTournamentService();
      const response = await NotificationService.promise(
        tournamentService.saveGroup(formats.formatId!, {
          groups,
          teams,
        }),
        {
          loading: t('notifications.savingGroups'),
          success: t('notifications.groupsSaved'),
          error: t('notifications.error'),
        }
      );

      if (response) {
        setGroups(response.groups);
        setTeams(response.teams);
        router.push(`/tournament/${tournament.tournamentId}`);
      }
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

            {currentStep === TournamentCreationStep.TOURNAMENT_INFO && (
              <form onSubmit={handleSubmitTournamentInfo} className="mt-8 space-y-8">
                {renderStepContent()}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={!isTournamentInfoValid()}
                    className={`flex-1 rounded-lg py-3 px-4 font-medium text-lg ${
                      isTournamentInfoValid()
                        ? 'bg-[#39846d] text-white hover:bg-[#2c6353]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-colors duration-200`}
                  >
                    {t('next')}
                  </button>
                </div>
              </form>
            )}

            {currentStep === TournamentCreationStep.FORMATS && (
              <form onSubmit={handleSubmitFormats} className="mt-8 space-y-8">
                {renderStepContent()}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-3 px-4 hover:bg-gray-200 transition-colors duration-200 font-medium text-lg"
                  >
                    {t('back')}
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormatsValid()}
                    className={`flex-1 rounded-lg py-3 px-4 font-medium text-lg ${
                      isFormatsValid()
                        ? 'bg-[#39846d] text-white hover:bg-[#2c6353]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-colors duration-200`}
                  >
                    {t('next')}
                  </button>
                </div>
              </form>
            )}

            {currentStep === TournamentCreationStep.GROUPS_AND_TEAMS && (
              <form onSubmit={handleSubmitGroupAndTeam} className="mt-8 space-y-8">
                {renderStepContent()}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-3 px-4 hover:bg-gray-200 transition-colors duration-200 font-medium text-lg"
                  >
                    {t('back')}
                  </button>
                  <button
                    type="submit"
                    disabled={!isGroupsAndTeamsValid()}
                    className={`flex-1 rounded-lg py-3 px-4 font-medium text-lg ${
                      isGroupsAndTeamsValid()
                        ? 'bg-[#39846d] text-white hover:bg-[#2c6353]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-colors duration-200`}
                  >
                    {t('finish')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 