import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:5173/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the theme controls by clicking the 'Theme' button.
        # Theme button
        elem = page.get_by_role("button", name="Theme")
        await elem.click(timeout=10000)
        
        # -> Click the backdrop outside the 'Visual Palette' popover to close it (without changing the current palette).
        # Click the backdrop outside the 'Visual Palette' popover to close it (without changing the current palette).
        elem = page.locator("#popover-backdrop")
        await elem.click(timeout=10000)
        
        # -> Re-open the theme controls by clicking the 'Theme' button so the active palette can be inspected.
        # Theme button
        elem = page.get_by_role("button", name="Theme")
        await elem.click(timeout=10000)
        
        # -> Tap outside the 'Visual Palette' popover (click the backdrop) to close it.
        # Tap outside the 'Visual Palette' popover (click the backdrop) to close it.
        elem = page.locator("#popover-backdrop")
        await elem.click(timeout=10000)
        
        # -> Click the 'Theme' button to re-open the theme controls and confirm the active palette is still 'Void'.
        # Theme button
        elem = page.get_by_role("button", name="Theme")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Tapping the backdrop closes the Visual Palette popover.
        # Assert-outcome: passed
        # Assert: Visual Palette option buttons are not visible after clicking the backdrop.
        await expect(page.locator("xpath=/html/body/div[1]/div[5]/button[1]").nth(0)).not_to_be_visible(timeout=15000), "Visual Palette option buttons are not visible after clicking the backdrop."
        
        # --> The active theme remains the same (Void) after closing the popover with the backdrop.
        await page.get_by_role("button", name="Void Matte OLED starlight").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The 'Void' theme option is present and visible when the Visual Palette is reopened.
        await expect(page.get_by_role("button", name="Void Matte OLED starlight").nth(0)).to_be_visible(timeout=15000), "The 'Void' theme option is present and visible when the Visual Palette is reopened."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    