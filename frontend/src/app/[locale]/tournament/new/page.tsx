'use client'

import { useTranslations } from 'next-intl';
import { Link } from '@src/i18n/routing';
import { useState } from 'react';
import { TournamentModel, defaultTournament } from '@/data-models/tournament.model';
import { BestOf, PlayOffFormat, WinningCondition } from '@/enums/tournament.enum';
import { ServiceFactory } from '@/services/service.factory';
import { NotificationService } from '@/services/notification/notification.service';
import { ErrorService } from '@/services/error/error.service';
import { useRouter } from 'next/navigation';
import { formatDateForInput, formatDateForServer } from '@/utils/date.utils';

const RequiredLabel: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center">
    <span className="block text-sm font-medium text-gray-700">{text}</span>
    <span className="text-red-500 ml-1">*</span>
  </div>
);

export default function NewTournamentPage() {
  const t = useTranslations('NewTournament');
  const router = useRouter();
  
  const [formData, setFormData] = useState<TournamentModel>(defaultTournament);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'datetime-local' 
        ? formatDateForServer(value)
        : e.target.type === 'number' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tournamentService = ServiceFactory.getTournamentService();
      
      await NotificationService.promise(
        tournamentService.createTournament(formData),
        {
          loading: t('notifications.creating'),
          success: t('notifications.created'),
          error: (err) => ErrorService.handle(err),
        }
      );

      // Redirect to tournaments list or show success message
      // router.push('/tournaments');
    } catch (error) {
      if (!ErrorService.isHttpError(error)) {
        NotificationService.error(ErrorService.handle(error));
      }
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

          <form className="p-8 space-y-8" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center text-[#39846d]">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                {t('basicInfo')}
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <RequiredLabel text={t('name')} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      {t('description')}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <RequiredLabel text={t('startDate')} />
                      <input
                        type="datetime-local"
                        id="startDate"
                        name="startDate"
                        value={formatDateForInput(formData.startDate)}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                      />
                    </div>

                    <div>
                      <RequiredLabel text={t('endDate')} />
                      <input
                        type="datetime-local"
                        id="endDate"
                        name="endDate"
                        value={formatDateForInput(formData.endDate)}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Group Stage Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center text-[#39846d]">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>
                {t('groupStage')}
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="numOfGroups" className="block text-sm font-medium text-gray-700">
                      {t('numOfGroups')}
                    </label>
                    <input
                      type="number"
                      id="numOfGroups"
                      name="numOfGroups"
                      min="1"
                      value={formData.numOfGroups}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="groupBestOf" className="block text-sm font-medium text-gray-700">
                      {t('bestOf')}
                    </label>
                    <select
                      id="groupBestOf"
                      name="groupBestOf"
                      value={formData.groupBestOf}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    >
                      {Object.values(BestOf)
                        .filter(value => typeof value === 'number')
                        .map(value => (
                          <option key={value} value={value}>Best of {value}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div>
                    <label htmlFor="groupWinning" className="block text-sm font-medium text-gray-700">
                      {t('winningCondition')}
                    </label>
                    <select
                      id="groupWinning"
                      name="groupWinning"
                      value={formData.groupWinning}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    >
                      <option value={WinningCondition.EXACT}>{t('exact')}</option>
                      <option value={WinningCondition.TWO_POINTS_DIFFERENCE}>{t('twoPointsDifference')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="groupScore" className="block text-sm font-medium text-gray-700">
                      {t('scorePerWin')}
                    </label>
                    <input
                      type="number"
                      id="groupScore"
                      name="groupScore"
                      min="0"
                      value={formData.groupScore}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="groupMaxScore" className="block text-sm font-medium text-gray-700">
                      {t('maxScore')}
                    </label>
                    <input
                      type="number"
                      id="groupMaxScore"
                      name="groupMaxScore"
                      min="0"
                      value={formData.groupMaxScore}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Playoff Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center text-[#39846d]">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                {t('playoffStage')}
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="playOffBestOf" className="block text-sm font-medium text-gray-700">
                      {t('bestOf')}
                    </label>
                    <select
                      id="playOffBestOf"
                      name="playOffBestOf"
                      value={formData.playOffBestOf}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    >
                      {Object.values(BestOf)
                        .filter(value => typeof value === 'number')
                        .map(value => (
                          <option key={value} value={value}>Best of {value}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div>
                    <label htmlFor="playOffFormat" className="block text-sm font-medium text-gray-700">
                      {t('format')}
                    </label>
                    <select
                      id="playOffFormat"
                      name="playOffFormat"
                      value={formData.playOffFormat}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    >
                      <option value={PlayOffFormat.SINGLE_ELIMINATION}>{t('singleElimination')}</option>
                      <option value={PlayOffFormat.DOUBLE_ELIMINATION}>{t('doubleElimination')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="playOffScore" className="block text-sm font-medium text-gray-700">
                      {t('scorePerWin')}
                    </label>
                    <input
                      type="number"
                      id="playOffScore"
                      name="playOffScore"
                      min="0"
                      value={formData.playOffScore}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="playOffMaxScore" className="block text-sm font-medium text-gray-700">
                      {t('maxScore')}
                    </label>
                    <input
                      type="number"
                      id="playOffMaxScore"
                      name="playOffMaxScore"
                      min="0"
                      value={formData.playOffMaxScore}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#39846d] text-white rounded-lg py-3 px-4 hover:bg-[#2c6353] transition-colors duration-200 font-medium text-lg"
              >
                {t('createButton')}
              </button>
              <Link href="/" className="flex-1">
                <button
                  type="button"
                  className="w-full bg-gray-100 text-gray-700 rounded-lg py-3 px-4 hover:bg-gray-200 transition-colors duration-200 font-medium text-lg border border-gray-300"
                >
                  {t('cancelButton')}
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 