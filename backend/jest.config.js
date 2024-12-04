module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node', // 或 'jsdom'，根据测试目标选择
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/__tests__/**/*.test.ts',], // 匹配测试文件
    transform: {
        '^.+\\.ts$': 'ts-jest', // 转换 TypeScript
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'], // 忽略这些路径
};
