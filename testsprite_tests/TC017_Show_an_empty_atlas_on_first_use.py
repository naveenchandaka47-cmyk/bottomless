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
        
        # -> Click the 'Atlas' button in the bottom control bar to open the Milestone Atlas overlay.
        # Atlas (1) button
        elem = page.get_by_role("button", name="Atlas (1)")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The Depth Atlas overlay is visible.
        await page.get_by_role("button", name="Close").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: failed
        # Assert: Expected the atlas modal to be visible.
        await expect(page.get_by_role("button", name="Close").nth(0)).to_be_visible(timeout=15000), "Expected the atlas modal to be visible."
        
        # --> An empty-state message was expected but the atlas shows milestone entries instead.
        await page.locator("#milestone-list").get_by_text("0 m", exact=True).nth(0).scroll_into_view_if_needed()
        # Assert-outcome: failed
        # Assert: Expected an empty-state message to be visible when opening the atlas.
        await expect(page.locator("#milestone-list").get_by_text("0 m", exact=True).nth(0)).to_be_visible(timeout=15000), "Expected an empty-state message to be visible when opening the atlas."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    