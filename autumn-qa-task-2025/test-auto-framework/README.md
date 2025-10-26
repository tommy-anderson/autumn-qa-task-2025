# Task Manager - Playwright Test Automation Framework

A comprehensive end-to-end testing framework for the Task Manager application, built with Playwright and TypeScript.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Page Objects](#page-objects)
- [Best Practices](#best-practices)
- [Configuration](#configuration)
- [Reporting](#reporting)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This test automation framework is designed for testing the Task Manager React application. It follows industry best practices including:

- **Page Object Model (POM)** for maintainable test code
- **Custom Fixtures** for dependency injection and test setup
- **Service Layer** for business logic and test data management
- **Utility Helpers** for common operations
- **Comprehensive Documentation** for ease of use

### Key Features

- ✅ Full test coverage for all user stories
- 🎭 Multi-browser support (Chromium, Firefox, WebKit)
- 📱 Mobile viewport testing
- 📸 Screenshot capabilities
- 🔄 Automatic retry on failure
- 📊 HTML and JSON test reports
- 🧹 Automatic test cleanup

## 🏗️ Architecture

The framework follows a layered architecture:

```
┌─────────────────────────────────────┐
│         Test Specs                  │  ← Test scenarios
├─────────────────────────────────────┤
│         Page Objects                │  ← UI interaction layer
├─────────────────────────────────────┤
│    Services & Helpers               │  ← Business logic
├─────────────────────────────────────┤
│         Fixtures                    │  ← Dependency injection
├─────────────────────────────────────┤
│       Playwright Core               │  ← Browser automation
└─────────────────────────────────────┘
```

## 📦 Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: For version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "QA Task"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Verify installation**
   ```bash
   npx playwright test --version
   ```

## 📁 Project Structure

```
QA Task/
├── fixtures/              # Custom Playwright fixtures
│   └── index.ts          # Fixture definitions
├── pages/                 # Page Object Models
│   ├── BasePage.ts       # Base page class
│   ├── TaskManagerPage.ts # Task Manager page object
│   └── index.ts          # Exports
├── services/              # Business logic & data management
│   ├── TaskService.ts    # Task-related operations
│   ├── TestDataService.ts # Test data management
│   └── index.ts          # Exports
├── tests/                 # Test specifications
│   └── user-stories/     # User story tests
│       ├── add-task.spec.ts
│       ├── delete-task.spec.ts
│       └── edit-task.spec.ts
├── utils/                 # Utility helpers
│   ├── Logger.ts         # Logging utility
│   ├── ScreenshotHelper.ts # Screenshot utility
│   ├── TestDataGenerator.ts # Test data generation
│   ├── WaitHelper.ts     # Wait strategies
│   └── index.ts          # Exports
├── playwright.config.ts   # Playwright configuration
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test suite
```bash
npm run test:user-stories    # Run all user story tests
npm run test:smoke           # Run smoke tests only
npm run test:critical        # Run critical tests only
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View test report
```bash
npm run test:report
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '../../fixtures';

test.describe('Feature Name', () => {
  
  test.beforeEach(async ({ taskManagerPage }) => {
    // Setup: Clear state before each test
    await taskManagerPage.clearLocalStorage();
  });

  test('should perform action @smoke', async ({ 
    taskManagerPage, 
    taskService 
  }) => {
    // Arrange
    const task = taskService.createValidTask({
      title: 'Test Task',
      importance: 'High',
    });

    // Act
    await taskManagerPage.addTask(task);

    // Assert
    const isVisible = await taskManagerPage.isTaskVisible('Test Task');
    expect(isVisible).toBeTruthy();
  });
});
```

### Using Fixtures

The framework provides several custom fixtures:

- **taskManagerPage**: TaskManagerPage instance (auto-navigates to app)
- **taskService**: TaskService for test data generation
- **testDataService**: TestDataService for state management
- **screenshotHelper**: ScreenshotHelper for capturing screenshots
- **logger**: Logger for test logging

```typescript
test('example test', async ({ 
  taskManagerPage,    // Page Object
  taskService,        // Test data service
  logger             // Logger
}) => {
  logger.info('Starting test');
  
  const task = taskService.createValidTask();
  await taskManagerPage.addTask(task);
  
  logger.info('Test completed');
});
```

## 📄 Page Objects

### TaskManagerPage

Main page object for interacting with the Task Manager application.

#### Key Methods

```typescript
// Navigation
await taskManagerPage.navigate();

// Add Task
await taskManagerPage.addTask({
  title: 'My Task',
  description: 'Task description',
  importance: 'High',
  label: 'Work'
});

// Edit Task
await taskManagerPage.editTask('Old Title', {
  title: 'New Title',
  importance: 'Low'
});

// Delete Task
await taskManagerPage.deleteTask('Task Title');

// Toggle Completion
await taskManagerPage.toggleTaskCompletion('Task Title');

// Filtering and Sorting
await taskManagerPage.filterByLabel('Work');
await taskManagerPage.sortByImportance('desc');

// Assertions
const isVisible = await taskManagerPage.isTaskVisible('Task Title');
const taskCount = await taskManagerPage.getTaskCount();
const details = await taskManagerPage.getTaskDetails('Task Title');
const isCompleted = await taskManagerPage.isTaskCompleted('Task Title');

// State Management
await taskManagerPage.clearLocalStorage();
const tasks = await taskManagerPage.getTasksFromLocalStorage();
```

### BasePage

Base class providing common functionality:

```typescript
// Navigation
await basePage.goto('/path');
await basePage.reload();
await basePage.goBack();

// Waits
await basePage.waitForPageLoad();
await basePage.waitForNetworkIdle();
await basePage.waitForVisible(locator);

// Utilities
await basePage.takeScreenshot('name');
const title = await basePage.getTitle();
const url = await basePage.getUrl();
await basePage.clearStorage();
```

## Best Practices

### 1. Follow AAA Pattern

Structure tests using Arrange-Act-Assert:

```typescript
test('should add task', async ({ taskManagerPage }) => {
  // Arrange
  const task = { title: 'Test Task', importance: 'High' };
  
  // Act
  await taskManagerPage.addTask(task);
  
  // Assert
  expect(await taskManagerPage.isTaskVisible('Test Task')).toBeTruthy();
});
```

### 2. Use Descriptive Names

```typescript
// ✅ Good
test('should display error when adding task without title')

// ❌ Bad
test('test1')
```

### 3. Clean Up Test Data

```typescript
test.beforeEach(async ({ taskManagerPage }) => {
  await taskManagerPage.clearLocalStorage();
});
```

### 4. Use Tags for Test Organization

```typescript
test('critical functionality @smoke @critical', async () => {
  // test code
});
```

### 5. Avoid Hard-Coded Waits

```typescript
// ✅ Good
await taskManagerPage.waitForTaskCount(5);

// ❌ Bad
await page.waitForTimeout(5000);
```

### 6. Keep Tests Independent

Each test should be able to run independently without relying on other tests.

### 7. Use Page Objects

Never interact with locators directly in tests:

```typescript
// ✅ Good
await taskManagerPage.addTask(task);

// ❌ Bad
await page.locator('input').fill('title');
```

## ⚙️ Configuration

### playwright.config.ts

Key configuration options:

```typescript
{
  testDir: './tests',           // Test directory
  timeout: 30000,               // Test timeout
  retries: process.env.CI ? 2 : 0,  // Retry on CI
  baseURL: 'http://localhost:5173', // App URL
  
  use: {
    screenshot: 'only-on-failure',  // Screenshots
    video: 'retain-on-failure',     // Videos
    trace: 'on-first-retry',        // Traces
  }
}
```

### Environment Variables

- `BASE_URL`: Override the default application URL
- `CI`: Enable CI-specific settings

```bash
BASE_URL=http://localhost:3000 npm test
```

## 📊 Reporting

### HTML Report

Generated automatically after test runs:

```bash
npm run test:report
```

Opens an interactive HTML report with:
- Test results and timings
- Screenshots and videos
- Traces for failed tests
- Detailed error messages

### JSON Report

Located at: `test-results/results.json`

Useful for CI/CD integration and custom reporting.

## 🐛 Troubleshooting

### Tests failing intermittently

1. Check for hard-coded waits
2. Increase timeout values in `playwright.config.ts`
3. Use explicit waits instead of implicit ones

### Browser not launching

```bash
npx playwright install --force
```

### Application not starting

1. Verify the app is running: `npm run dev`
2. Check the port in `playwright.config.ts` matches the app
3. Ensure no other process is using port 5173

### TypeScript errors

```bash
npm install
npx tsc --noEmit
```

### Screenshots not saved

1. Ensure `screenshots/` directory exists
2. Check file permissions
3. Verify disk space

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices for Test Automation](https://playwright.dev/docs/best-practices)

## Contributing

1. Write tests following the existing patterns
2. Add JSDoc comments to all public methods
3. Update this README if adding new features
4. Run tests before committing: `npm test`

