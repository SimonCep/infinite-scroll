import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
    transform: {
        "^.+\\.tsx?$": ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }]
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/mocks/fileMock.js',
        '^src/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss)$': '<rootDir>/test/mocks/fileMock.js',
    },
}

export default config