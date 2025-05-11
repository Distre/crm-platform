import { useState } from 'react';
import type { ActivityFilter, UserActivityFormProps } from './types';

export function UserActivityForm({ onSubmit, filter }: UserActivityFormProps) {
  const [formFilter, setFormFilter] = useState<ActivityFilter>(filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formFilter);
  };

  const handleDateChange = (startDate: string | undefined, endDate: string | undefined) => {
    setFormFilter(prev => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Filtrer aktivitet</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Periode</label>
            <div className="flex gap-2">
              <div className="w-1/2">
                <label htmlFor="startDate" className="block text-sm mb-1">Startdato</label>
                <input
                  id="startDate"
                  type="date"
                  value={formFilter.startDate || ''}
                  onChange={(e) => handleDateChange(e.target.value, formFilter.endDate)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="endDate" className="block text-sm mb-1">Sluttdato</label>
                <input
                  id="endDate"
                  type="date"
                  value={formFilter.endDate || ''}
                  onChange={(e) => handleDateChange(formFilter.startDate, e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="actionType" className="block mb-2">Handlingstype</label>
            <select
              id="actionType"
              value={formFilter.actionType || ''}
              onChange={(e) => setFormFilter(prev => ({ ...prev, actionType: e.target.value || undefined }))}
              className="w-full p-2 border rounded"
            >
              <option value="">Alle</option>
              <option value="LOGIN">Innlogging</option>
              <option value="LOGOUT">Utlogging</option>
              <option value="ACTION">Handling</option>
            </select>
          </div>

          <div>
            <label htmlFor="user" className="block mb-2">Bruker</label>
            <input
              id="user"
              type="text"
              value={formFilter.user || ''}
              onChange={(e) => setFormFilter(prev => ({ ...prev, user: e.target.value || undefined }))}
              placeholder="Søk etter bruker..."
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setFormFilter({})}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Nullstill
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Filtrer
          </button>
        </div>
      </form>
    </div>
  );
}