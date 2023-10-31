module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@ionic|other-module)/)',
      ],

  };
  