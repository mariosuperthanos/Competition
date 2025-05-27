import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

// Config custom
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Transformă lucide-react din node_modules
  transformIgnorePatterns: [
    "/node_modules/(?!(lucide-react)/)"
  ],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // dacă ai nevoie
}

export default createJestConfig(config)