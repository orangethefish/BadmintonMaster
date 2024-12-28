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
import { FormatModel, defaultFormat } from '@/data-models/format.model';
import FormatForm from '../../components/FormatForm';

const RequiredLabel: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center">
    <span className="block text-sm font-medium text-gray-700">{text}</span>
    <span className="text-red-500 ml-1">*</span>
  </div>
);

export default function NewTournamentPage() {
  const t = useTranslations('NewTournament');
  const router = useRouter();
  
  const [tournament, setTournament] = useState<TournamentModel>(defaultTournament);
  const [formats, setFormats] = useState<FormatModel[]>([{ ...defaultFormat }]);

  const handleTournamentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTournament(prev => ({
      ...prev,
      [name]: e.target.type === 'datetime-local' 
        ? formatDateForServer(value)
        : value
    }));
  };

  const handleFormatUpdate = (index: number, updatedFormat: FormatModel) => {
    setFormats(prev => {
      const newFormats = [...prev];
      newFormats[index] = updatedFormat;
      return newFormats;
    });
  };

  const handleAddFormat = () => {
    setFormats(prev => [...prev, { ...defaultFormat }]);
  };

  const handleRemoveFormat = (index: number) => {
    setFormats(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tournamentService = ServiceFactory.getTournamentService();
      
      await NotificationService.promise(
        tournamentService.createTournament({ tournament, formats }),
        {
          loading: t('notifications.creating'),
          success: t('notifications.created'),
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
                      value={tournament.name}
                      onChange={handleTournamentChange}
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
                      onChange={handleTournamentChange}
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
                        onChange={handleTournamentChange}
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
                        onChange={handleTournamentChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    onRemove={() => handleRemoveFormat(index)}
                    showRemoveButton={formats.length > 1}
                  />
                ))}

                <button
                  type="button"
                  onClick={handleAddFormat}
                  className="w-full py-2 px-4 border border-[#39846d] text-[#39846d] rounded-md hover:bg-[#39846d] hover:text-white transition-colors duration-200"
                >
                  {t('formats.addFormat')}
                </button>
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