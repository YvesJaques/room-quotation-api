import { pathsToModuleNameMapper } from 'ts-jest'

export default {
  bail: true,
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@/*': ['./src/*'],
    },
    {
      prefix: '<rootDir>',
    },
  ),
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
}
