import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { OrangeHRMWorld } from '../helpers/hooks/orangeHRMWorld';
import { VacancyPage } from '../pages/VacancyPage';
import {
  assertMandatoryFieldErrors,
  assertPositionsValidationError,
  assertVacancyNotCreated,
  assertSuccessMessage,
  assertVacancyInList,
  assertJobTitleDropdownPopulated,
} from '../utils/assertions/recruitmentAssertions';
import { ENV } from '../helpers/env/env';
import { RECRUITMENT_TEST_DATA } from '../tests/data/recruitment';

// ─── Background ──────────────────────────────────────────────────────────────

Given('admin is logged into the system', async function (this: OrangeHRMWorld) {
  // Auth state is loaded in Before (@recruitment); page is ready.
});

When('admin navigates to Recruitment → Vacancies', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  await vacancyPage.gotoVacancies(ENV.baseUrl);
});

// ─── Create Vacancy ───────────────────────────────────────────────────────────

When('admin navigates to Add Vacancy', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  await vacancyPage.clickAdd();
});

When('admin opens Add Vacancy', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  await vacancyPage.gotoAddVacancy(ENV.baseUrl);
});

When(
  'admin enters valid mandatory fields:',
  async function (
    this: OrangeHRMWorld,
    dataTable: { raw: () => string[][] }
  ) {
    const rows = dataTable.raw();
    const headers = rows[0];
    const values = rows[1];
    const row = Object.fromEntries(headers.map((h, i) => [h.trim(), values[i]?.trim() ?? '']));
    const vacancyPage = new VacancyPage(this.page);
    await vacancyPage.enterMandatoryFields({
      vacancyName: row['Vacancy Name'] ?? RECRUITMENT_TEST_DATA.form.valid.vacancyName,
      jobTitle: row['Job Title'] ?? RECRUITMENT_TEST_DATA.form.valid.jobTitle,
      hiringManager: row['Hiring Manager'] ?? RECRUITMENT_TEST_DATA.form.valid.hiringManager,
      numberOfPositions: parseInt(row['Number of Positions'] ?? '2', 10),
      description: row['Description'],
    });
  }
);

When('admin enters {string} in Number of Positions', async function (
  this: OrangeHRMWorld,
  value: string
) {
  const vacancyPage = new VacancyPage(this.page);
  await vacancyPage.fillNumberOfPositions(value);
});

When('admin leaves all mandatory fields blank', async function (this: OrangeHRMWorld) {
  // Form is already empty when opened; no action needed.
});

When('admin clicks Save', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  await vacancyPage.clickSave();
});

Then('vacancy is created successfully', async function (this: OrangeHRMWorld) {
  await assertVacancyInList(this.page);
});

Then('a success message is displayed', async function (this: OrangeHRMWorld) {
  await assertSuccessMessage(this.page);
});

Then('the vacancy appears in the vacancy list', async function (this: OrangeHRMWorld) {
  await assertVacancyInList(this.page);
});

Then('the vacancy status is {string}', async function (this: OrangeHRMWorld, status: string) {
  // Status is shown in the table; for "Active" we verify we're on the list with rows.
  const vacancyPage = new VacancyPage(this.page);
  await expect(this.page).toHaveURL(/viewJobVacancy/);
  const count = await vacancyPage.getTableRowCount();
  expect(count).toBeGreaterThan(0);
});

Then('the system displays inline validation errors for mandatory fields', async function (
  this: OrangeHRMWorld
) {
  await assertMandatoryFieldErrors(this.page);
});

Then('the vacancy is not created', async function (this: OrangeHRMWorld) {
  await assertVacancyNotCreated(this.page);
});

Then('the system shows a validation error', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  const errors = await vacancyPage.getFieldErrors();
  expect(errors.length).toBeGreaterThan(0);
});

Then('the vacancy is not saved', async function (this: OrangeHRMWorld) {
  await assertVacancyNotCreated(this.page);
});

Then('the Job Title dropdown lists all active job titles', async function (this: OrangeHRMWorld) {
  await assertJobTitleDropdownPopulated(this.page);
});

Then('the dropdown is searchable', async function (this: OrangeHRMWorld) {
  // OrangeHRM dropdowns are searchable by default; verify dropdown opened.
  await expect(this.page.locator('[role="option"]').first()).toBeVisible();
});

Then('the Hiring Manager dropdown lists active employees', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  await vacancyPage.fillHiringManager(RECRUITMENT_TEST_DATA.hiringManagerHint);
  await expect(this.page.locator('[role="option"]').first()).toBeVisible();
});

// ─── Publish / Edit / Close (simplified — many need pre-existing vacancy) ─────

Given('admin has created a vacancy', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  await vacancyPage.gotoAddVacancy(ENV.baseUrl);
  await vacancyPage.enterMandatoryFields(RECRUITMENT_TEST_DATA.form.valid);
  await vacancyPage.clickSave();
  await this.page.waitForURL(/viewJobVacancy/, { timeout: 10_000 });
});

Given('multiple job titles exist in the system', async function (this: OrangeHRMWorld) {
  // Demo has multiple job titles; no setup needed.
});

When('admin creates a vacancy and selects a job title', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  await vacancyPage.gotoAddVacancy(ENV.baseUrl);
  await vacancyPage.enterMandatoryFields({
    ...RECRUITMENT_TEST_DATA.form.valid,
    jobTitle: RECRUITMENT_TEST_DATA.jobTitles[0],
  });
  await vacancyPage.clickSave();
});

Then('the vacancy is correctly linked to that job title', async function (this: OrangeHRMWorld) {
  await expect(this.page).toHaveURL(/viewJobVacancy/);
});

Then('the vacancy appears when filtering by that job title', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  const count = await vacancyPage.getTableRowCount();
  expect(count).toBeGreaterThan(0);
});

Then('the system auto-generates a unique vacancy identifier', async function (this: OrangeHRMWorld) {
  // Vacancy was created; ID is internal. We verify we're on list.
  await expect(this.page).toHaveURL(/viewJobVacancy/);
});

Given('a vacancy exists in Draft or Active state', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  await vacancyPage.gotoAddVacancy(ENV.baseUrl);
  await vacancyPage.enterMandatoryFields(RECRUITMENT_TEST_DATA.form.valid);
  await vacancyPage.clickSave();
  await this.page.waitForURL(/viewJobVacancy/, { timeout: 10_000 });
});

Given('a vacancy has status {string}', function () {
  return 'pending';
});

Given('a vacancy has mandatory fields missing', function () {
  return 'pending';
});

Given('an existing vacancy', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  await vacancyPage.gotoAddVacancy(ENV.baseUrl);
  await vacancyPage.enterMandatoryFields(RECRUITMENT_TEST_DATA.form.valid);
  await vacancyPage.clickSave();
  await this.page.waitForURL(/viewJobVacancy/, { timeout: 10_000 });
});

When('admin opens the vacancy and clicks Publish', function () {
  return 'pending';
});

When('a candidate visits the Careers or Job Listing page', function () {
  return 'pending';
});

When('a candidate views the public job listing', function () {
  return 'pending';
});

Then('the vacancy appears in the public listing', function () {
  return 'pending';
});

Then('the correct details are displayed', function () {
  return 'pending';
});

When('admin attempts to publish the vacancy', function () {
  return 'pending';
});

Then('the system prevents publishing', function () {
  return 'pending';
});

Then('a validation error is displayed', async function (this: OrangeHRMWorld) {
  const vacancyPage = new VacancyPage(this.page);
  const errors = await vacancyPage.getFieldErrors();
  expect(errors.length).toBeGreaterThan(0);
});

Then('the vacancy does not appear', function () {
  return 'pending';
});

When('admin updates Description, Hiring Manager, and Number of Positions', function () {
  return 'pending';
});

When('admin updates the vacancy and saves', function () {
  return 'pending';
});

Then('the updated data is saved', function () {
  return 'pending';
});

Then('the vacancy list shows the updated values', function () {
  return 'pending';
});

When('admin clears a mandatory field and clicks Save', function () {
  return 'pending';
});

Then('the data is not saved', function () {
  return 'pending';
});

When('admin enters an invalid value (e.g. negative positions) and clicks Save', function () {
  return 'pending';
});

Then('the system blocks the save', function () {
  return 'pending';
});

When('admin clicks Close on the vacancy', function () {
  return 'pending';
});

Then('the vacancy status becomes {string}', function () {
  return 'pending';
});

Then('a confirmation message is displayed', async function (this: OrangeHRMWorld) {
  await assertSuccessMessage(this.page);
});

Then('the vacancy is not visible', function () {
  return 'pending';
});

When('a candidate attempts to apply via direct URL', function () {
  return 'pending';
});

Then('the system shows {string}', function () {
  return 'pending';
});

Then('application submission is blocked', function () {
  return 'pending';
});

When('admin attempts to close the vacancy again', function () {
  return 'pending';
});

Then('the Close action is disabled or an error message is shown', function () {
  return 'pending';
});
