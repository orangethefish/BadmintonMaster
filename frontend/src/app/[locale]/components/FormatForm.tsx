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

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
      <div className="flex justify-between items-center">
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
        {showRemoveButton && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800"
          >
            {t('formats.removeFormat')}
          </button>
        )}
      </div>

      {/* Group Stage Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('groupStage')}</h3>
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('playoffStage')}</h3>
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