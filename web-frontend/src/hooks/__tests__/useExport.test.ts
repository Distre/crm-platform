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

  it('should create a CSV file when called', () => {
    const { result } = renderHook(() => useExport('test', mockData));
    result.current();

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect((document.createElement('a') as HTMLAnchorElement).click).toBeDefined();
  });

  it('should handle empty data', () => {
    const { result } = renderHook(() => useExport('test', []));
    result.current();

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
  });
});
