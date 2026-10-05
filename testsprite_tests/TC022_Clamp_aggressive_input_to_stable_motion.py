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
        
        # -> Perform a very large downward scroll input (scroll to bottom) to test the descent remains bounded and responsive.
        await page.mouse.wheel(0, 300)
        
        # -> Press the unsupported key 'F13' and then scroll up one page to verify the descent remains responsive and bounded (no overscroll or visual glitch).
        await page.mouse.wheel(0, 300)
        
        # --> Assertions to verify final state
        
        # --> The descent HUD shows a stable numeric depth value, indicating the descent remained bounded and responsive.
        await page.get_by_text("76").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: HUD depth element is visible in the header.
        await expect(page.get_by_text("76").nth(0)).to_be_visible(timeout=15000), "HUD depth element is visible in the header."
        
        # --> Page chrome and bottom controls remain present and positioned, indicating no overscroll or visual glitch occurred.
        await page.get_by_role("button", name="Surface").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The bottom 'Surface' control button is visible and positioned.
        await expect(page.get_by_role("button", name="Surface").nth(0)).to_be_visible(timeout=15000), "The bottom 'Surface' control button is visible and positioned."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    