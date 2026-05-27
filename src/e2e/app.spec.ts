import { test, expect } from "@playwright/test";

test.describe("Scissor E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should shorten a URL", async ({ page }) => {
    // Navigate to dashboard
    await page.click("text=Sign In");
    
    // Wait for auth
    await page.waitForNavigation();
    
    // Fill in URL
    await page.fill('input[placeholder*="https"]', "https://example.com/very/long/url");
    
    // Submit form
    await page.click("button:has-text('Shorten URL')");
    
    // Check success
    await expect(page.locator("text=Link created successfully")).toBeVisible();
  });

  test("should validate custom slug uniqueness", async ({ page }) => {
    // Test slug collision detection
    await page.fill('input[placeholder*="https"]', "https://example.com/1");
    await page.fill('input[placeholder*="slug"]', "my-link");
    await page.click("button:has-text('Shorten URL')");
    
    // Second attempt with same slug
    await page.fill('input[placeholder*="https"]', "https://example.com/2");
    await page.fill('input[placeholder*="slug"]', "my-link");
    await page.click("button:has-text('Shorten URL')");
    
    // Should show error
    await expect(page.locator("text=Slug already taken")).toBeVisible();
  });

  test("should download QR code", async ({ page }) => {
    // Create a link first
    await page.fill('input[placeholder*="https"]', "https://example.com");
    await page.click("button:has-text('Shorten URL')");
    
    // Wait for QR code
    await page.waitForSelector('[role="img"]');
    
    // Click download button
    const downloadPromise = page.waitForEvent("download");
    await page.click("button:has-text('PNG')");
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toContain(".png");
  });

  test("should redirect short link", async ({ page }) => {
    // First create a link
    await page.fill('input[placeholder*="https"]', "https://example.com/target");
    await page.click("button:has-text('Shorten URL')");
    
    // Get the short URL from the clipboard
    await page.click("button[title='Copy to clipboard']");
    
    // Navigate to short link
    const slug = "test-slug"; // This would be captured from the previous step
    await page.goto(`/${slug}`);
    
    // Should redirect
    await page.waitForNavigation();
  });

  test("should delete a link", async ({ page }) => {
    // Create a link
    await page.fill('input[placeholder*="https"]', "https://example.com");
    await page.click("button:has-text('Shorten URL')");
    
    // Find delete button in table
    const deleteButton = page.locator("button[title='Delete']").first();
    await deleteButton.click();
    
    // Confirm deletion
    await page.click("button:has-text('Delete')");
    
    // Verify it's gone
    await expect(page.locator("text=Link deleted")).toBeVisible();
  });

  test("should show link analytics", async ({ page }) => {
    // Create and view analytics
    await page.fill('input[placeholder*="https"]', "https://example.com");
    await page.click("button:has-text('Shorten URL')");
    
    // Click on link to view analytics
    await page.click("text=View Analytics");
    
    // Check for analytics elements
    await expect(page.locator("text=Total Clicks")).toBeVisible();
    await expect(page.locator("text=Top Referrer")).toBeVisible();
  });

  test("should handle link expiration", async ({ page }) => {
    // Create link with expiry
    await page.fill('input[placeholder*="https"]', "https://example.com");
    await page.click("text=Show Advanced Options");
    await page.fill('input[placeholder="30"]', "1"); // 1 day expiry
    await page.click("button:has-text('Shorten URL')");
    
    // Check status shows active
    await expect(page.locator("text=Active")).toBeVisible();
  });

  test("should handle rate limiting for anonymous users", async ({ page }) => {
    // Create 5 links rapidly
    for (let i = 0; i < 5; i++) {
      await page.fill('input[placeholder*="https"]', `https://example.com/${i}`);
      await page.click("button:has-text('Shorten URL')");
      await page.waitForTimeout(100);
    }
    
    // 6th attempt should be rate limited
    await page.fill('input[placeholder*="https"]', "https://example.com/6");
    await page.click("button:has-text('Shorten URL')");
    await expect(page.locator("text=Rate limit exceeded")).toBeVisible();
  });
});
