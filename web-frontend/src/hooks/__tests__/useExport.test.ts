import { useExport } from '../useExport';
import { renderHook } from '@testing-library/react-hooks';

describe('useExport', () => {
  const mockData = [
    { måned: 'Januar', betalt: 1000, ubetalt: 500, totalt: 1500 },
    { måned: 'Februar', betalt: 1500, ubetalt: 750, totalt: 2250 }
  ];

  beforeEach(() => {
    jest.spyOn(URL, 'createObjectURL').mockImplementation(() => 'mock-url');
    jest.spyOn(document, 'createElement').mockImplementation(() => {
      const element = document.createElement('a');
      element.click = jest.fn();
      return element;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a CSV file with correct content', () => {
    const { result } = renderHook(() => useExport('test', mockData));
    
    result.current();

    const expectedContent = [
      'måned,betalt,ubetalt,totalt',
      'Januar,1000,500,1500',
      'Februar,1500,750,2250'
    ].join('\n');

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(document.createElement('a').click).toHaveBeenCalled();
  });

  it('should handle empty data', () => {
    const { result } = renderHook(() => useExport('test', []));
    
    result.current();

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
  });
});
