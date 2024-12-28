'use client'

import { FormatType } from '@/enums/tournament.enum';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
  formatId: number;
  formatType: FormatType;
  onUpdate: (groups: Group[]) => void;
}

export default function GroupTeamForm({ formatId, formatType, onUpdate }: GroupTeamFormProps) {
  const t = useTranslations('NewTournament.groupsAndTeams');
  const [groups, setGroups] = useState<Group[]>([{
    groupName: 'Group A',
    numOfTeams: 4,
    teams: Array(4).fill({ player1Name: '', player2Name: '' })
  }]);

  const isDoubles = [
    FormatType.MEN_DOUBLES,
    FormatType.WOMEN_DOUBLES,
    FormatType.MIXED_DOUBLES
  ].includes(formatType);

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

  const addGroup = () => {
    const newGroup: Group = {
      groupName: `Group ${String.fromCharCode(65 + groups.length)}`, // A, B, C, etc.
      numOfTeams: 4,
      teams: Array(4).fill({ player1Name: '', player2Name: '' })
    };
    setGroups([...groups, newGroup]);
  };

  const removeGroup = (index: number) => {
    const newGroups = groups.filter((_, i) => i !== index);
    setGroups(newGroups);
    onUpdate(newGroups);
  };

  return (
    <div className="space-y-6">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="bg-gray-50 p-6 rounded-lg space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{group.groupName}</h3>
            {groups.length > 1 && (
              <button
                type="button"
                onClick={() => removeGroup(groupIndex)}
                className="text-red-600 hover:text-red-800"
              >
                {t('removeGroup')}
              </button>
            )}
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

      <button
        type="button"
        onClick={addGroup}
        className="w-full py-2 px-4 border border-[#39846d] text-[#39846d] rounded-md hover:bg-[#39846d] hover:text-white transition-colors duration-200"
      >
        {t('addGroup')}
      </button>
    </div>
  );
} 