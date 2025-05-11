import { useCallback } from 'react';

interface ExportData {
  [key: string]: any;
}

export const useExport = (filename: string, data: ExportData[]) => {
  const exportToCSV = useCallback(() => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const cell = row[header];
          return typeof cell === 'string' ? 
            `${cell}` : 
            cell;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [data, filename]);

  return exportToCSV;
};
