export const mockStatusBar = jasmine.createSpyObj('StatusBar', ['styleDefault']);
export const mockSplashScreen = jasmine.createSpyObj('SplashScreen', ['hide']);
export const mockPlatformReady = Promise.resolve();
export const mockPlatform = jasmine.createSpyObj('Platform', {ready: mockPlatformReady});
export const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
