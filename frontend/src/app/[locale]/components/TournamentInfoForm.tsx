'use client'

import { TournamentModel } from '@/data-models/tournament.model';
import { useTranslations } from 'next-intl';
import { formatDateForInput } from '@/utils/date.utils';

interface TournamentInfoFormProps {
  tournament: TournamentModel;
  onUpdate: (field: string, value: string) => void;
}

const RequiredLabel: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center">
    <span className="block text-sm font-medium text-gray-700">{text}</span>
    <span className="text-red-500 ml-1">*</span>
  </div>
);

export default function TournamentInfoForm({ tournament, onUpdate }: TournamentInfoFormProps) {
  const t = useTranslations('NewTournament');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate(e.target.name, e.target.value);
  };

  return (
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
              value={tournament.name}
              onChange={handleChange}
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
              value={tournament.description}
              onChange={handleChange}
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
                value={formatDateForInput(tournament.startDate)}
                onChange={handleChange}
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
                value={formatDateForInput(tournament.endDate)}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 