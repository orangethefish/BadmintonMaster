'use client'

import { FormatModel } from '@/data-models/format.model';
import { BestOf, FormatType, PlayOffFormat, WinningCondition } from '@/enums/tournament.enum';
import { useTranslations } from 'next-intl';

interface FormatFormProps {
  format: FormatModel;
  onUpdate: (format: FormatModel) => void;
  onRemove: () => void;
  showRemoveButton: boolean;
}

export default function FormatForm({ format, onUpdate, onRemove, showRemoveButton }: FormatFormProps) {
  const t = useTranslations('NewTournament');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...format,
      [name]: e.target.type === 'number' ? Number(value) : Number(value),
    });
  };

  const fieldIcons = {
    numOfGroups: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    bestOf: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    score: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39846d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <select
            name="formatType"
            value={format.formatType}
            onChange={handleChange}
            className="mt-1 block w-64 rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
          >
            {Object.entries(FormatType)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <option key={value} value={value}>
                  {t(`formats.types.${key}`)}
                </option>
              ))}
          </select>
        </div>
        {showRemoveButton && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('formats.removeFormat')}
          </button>
        )}
      </div>

      {/* Group Stage Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#39846d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {t('groupStage')}
        </h3>
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
              value={format.numOfGroups}
              onChange={handleChange}
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
              value={format.groupBestOf}
              onChange={handleChange}
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
            <label htmlFor="groupWinningCondition" className="block text-sm font-medium text-gray-700">
              {t('winningCondition')}
            </label>
            <select
              id="groupWinningCondition"
              name="groupWinningCondition"
              value={format.groupWinningCondition}
              onChange={handleChange}
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
              value={format.groupScore}
              onChange={handleChange}
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
              value={format.groupMaxScore}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Playoff Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#39846d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t('playoffStage')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="playOffBestOf" className="block text-sm font-medium text-gray-700">
              {t('bestOf')}
            </label>
            <select
              id="playOffBestOf"
              name="playOffBestOf"
              value={format.playOffBestOf}
              onChange={handleChange}
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
              value={format.playOffFormat}
              onChange={handleChange}
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
              value={format.playOffScore}
              onChange={handleChange}
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
              value={format.playOffMaxScore}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
            />
          </div>
        </div>
      </div>

    </div>
  );
} 