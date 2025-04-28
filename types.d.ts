interface Window {
  electron: {
    subscribeStatistics: (callback: (statistics: any) => void) => void;
    getStaticData: () => Promise<any>;
  };
}
