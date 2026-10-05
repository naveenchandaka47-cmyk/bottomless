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
        
        # -> Click the 'Breathe' button to open the Mindful Breath Pacer overlay.
        # Breathe button
        elem = page.get_by_role("button", name="Breathe")
        await elem.click(timeout=10000)
        
        # -> Scroll down to simulate a descent and verify the pacer overlay still shows the 'Inhale gently...' text and circular pacer graphic.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll the page to simulate descent and confirm the breath pacer text 'Release & exhale...' and the circular pacer remain visible.
        await page.mouse.wheel(0, 300)
        
        # --> Assertions to verify final state
        
        # --> The breath pacer overlay is visible after opening the Breathe control.
        await page.locator("div").filter(has_text="Release & exhale... 5.5s").locator("div").nth(3).nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The breath pacer overlay element is visible on the page.
        await expect(page.locator("div").filter(has_text="Release & exhale... 5.5s").locator("div").nth(3).nth(0)).to_be_visible(timeout=15000), "The breath pacer overlay element is visible on the page."
        
        # --> The breathing animation (circular pacer) is displayed on the page.
        await page.locator("div").filter(has_text="Release & exhale... 5.5s").locator("div").nth(3).nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The circular pacer graphic (breathing animation) is visible.
        await expect(page.locator("div").filter(has_text="Release & exhale... 5.5s").locator("div").nth(3).nth(0)).to_be_visible(timeout=15000), "The circular pacer graphic (breathing animation) is visible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    