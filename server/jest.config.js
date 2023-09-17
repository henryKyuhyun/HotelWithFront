//server/jest.config.js

module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)"
  ],
  // testEnvironment: 'jsdom-sixteen',   //sixteen 은 jest26버전임
  testEnvironment: 'jsdom', 

  testEnvironmentOptions: {
    url: 'http://localhost', 
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'], //d 여기를 수정했습니다.
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
  },
};

// .js 및 .jsx 파일에 대해 Babel 변환을 적용하도록 JEST 에 지시, 이렇게하면 최신 JS문법으로 작성된 코드도 정상적으로 동작.


