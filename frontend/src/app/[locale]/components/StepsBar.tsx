'use client'

import { TournamentCreationStep } from '@/enums/tournament.enum';
import { useTranslations } from 'next-intl';

interface StepsBarProps {
  currentStep: TournamentCreationStep;
}

export default function StepsBar({ currentStep }: StepsBarProps) {
  const t = useTranslations('NewTournament.steps');

  const steps = [
    { key: TournamentCreationStep.TOURNAMENT_INFO, label: t('tournamentInfo') },
    { key: TournamentCreationStep.FORMATS, label: t('formats') },
    { key: TournamentCreationStep.GROUPS_AND_TEAMS, label: t('groupsAndTeams') },
  ];

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Connector Lines */}
        <div className="absolute top-4 left-0 w-full h-0.5">
          <div className="w-full h-full flex">
            {steps.map((_, index) => (
              index < steps.length - 1 && (
                <div
                  key={index}
                  className={`flex-1 h-full mx-4 ${
                    index < currentStep ? 'bg-[#39846d]' : 'bg-gray-200'
                  }`}
                />
              )
            ))}
          </div>
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.key === currentStep 
                ? 'bg-[#39846d] text-white'
                : step.key < currentStep
                  ? 'bg-green-100 text-[#39846d]'
                  : 'bg-gray-200 text-gray-500'
            }`}>
              {step.key < currentStep ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.key + 1
              )}
            </div>
            <span className={`mt-2 text-sm ${
              step.key === currentStep 
                ? 'text-[#39846d] font-medium'
                : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 