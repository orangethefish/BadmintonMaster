'use client'

import { FormatType } from '@/enums/tournament.enum';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { FormatModel } from '@/data-models/format.model';

interface Team {
  player1Name: string;
  player2Name?: string;
}

interface Group {
  groupName: string;
  numOfTeams: number;
  teams: Team[];
}

interface GroupTeamFormProps {
  format: FormatModel;
  onUpdate: (groups: Group[]) => void;
}

export default function GroupTeamForm({ format, onUpdate }: GroupTeamFormProps) {
  const t = useTranslations('NewTournament.groupsAndTeams');
  const [groups, setGroups] = useState<Group[]>([]);

  const isDoubles = [
    FormatType.MEN_DOUBLES,
    FormatType.WOMEN_DOUBLES,
    FormatType.MIXED_DOUBLES
  ].includes(format.formatType);

  // Initialize or update groups when format changes
  useEffect(() => {
    const initialGroups = Array(format.numOfGroups).fill(null).map((_, index) => ({
      groupName: `Group ${String.fromCharCode(65 + index)}`, // A, B, C, etc.
      numOfTeams: 4,
      teams: Array(4).fill({ player1Name: '', player2Name: '' })
    }));
    setGroups(initialGroups);
    onUpdate(initialGroups);
  }, [format.numOfGroups]);

  const handleGroupChange = (index: number, field: keyof Group, value: string | number) => {
    const newGroups = [...groups];
    newGroups[index] = {
      ...newGroups[index],
      [field]: value,
      teams: field === 'numOfTeams' 
        ? Array(Number(value)).fill({ player1Name: '', player2Name: '' })
        : newGroups[index].teams
    };
    setGroups(newGroups);
    onUpdate(newGroups);
  };

  const handleTeamChange = (groupIndex: number, teamIndex: number, field: keyof Team, value: string) => {
    const newGroups = [...groups];
    newGroups[groupIndex].teams[teamIndex] = {
      ...newGroups[groupIndex].teams[teamIndex],
      [field]: value
    };
    setGroups(newGroups);
    onUpdate(newGroups);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center text-[#39846d]">
        <span className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </span>
        {format.formatType === FormatType.MEN_SINGLES ? t('types.MEN_SINGLES') :
         format.formatType === FormatType.WOMEN_SINGLES ? t('types.WOMEN_SINGLES') :
         format.formatType === FormatType.MEN_DOUBLES ? t('types.MEN_DOUBLES') :
         format.formatType === FormatType.WOMEN_DOUBLES ? t('types.WOMEN_DOUBLES') :
         t('types.MIXED_DOUBLES')}
      </h2>

      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="bg-gray-50 p-6 rounded-lg space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{group.groupName}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('groupName')}
              </label>
              <input
                type="text"
                value={group.groupName}
                onChange={(e) => handleGroupChange(groupIndex, 'groupName', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('numOfTeams')}
              </label>
              <input
                type="number"
                min="2"
                value={group.numOfTeams}
                onChange={(e) => handleGroupChange(groupIndex, 'numOfTeams', Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
              />
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">{t('teamSection')}</h4>
            <div className="space-y-3">
              {group.teams.map((team, teamIndex) => (
                <div key={teamIndex} className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder={t('player1')}
                      value={team.player1Name}
                      onChange={(e) => handleTeamChange(groupIndex, teamIndex, 'player1Name', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                    />
                  </div>
                  {isDoubles && (
                    <div>
                      <input
                        type="text"
                        placeholder={t('player2')}
                        value={team.player2Name}
                        onChange={(e) => handleTeamChange(groupIndex, teamIndex, 'player2Name', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#39846d] focus:ring-[#39846d] text-gray-900"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 