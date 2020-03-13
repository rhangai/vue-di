// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	preset: 'ts-jest',
	// Automatically clear mock calls and instances between every test
	clearMocks: true,
	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',
	collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
	// The paths to modules that run some code to configure or set up the testing environment before each test
	setupFiles: ['reflect-metadata'],
	// The test environment that will be used for testing
	testEnvironment: 'jsdom',
	// The glob patterns Jest uses to detect test files
	testMatch: ['<rootDir>/test/**/*.(spec|test).ts'],
};
