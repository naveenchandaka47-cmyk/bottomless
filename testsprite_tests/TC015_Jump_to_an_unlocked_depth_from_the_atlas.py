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
        
        # -> Scroll or drag to descend until a discovered landmark appears (use the page's scroll to descend).
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'Atlas (1)' button to open the Milestone Atlas overlay.
        # Atlas (1) button
        elem = page.get_by_role("button", name="Atlas (1)")
        await elem.click(timeout=10000)
        
        # -> Click the 'Glide to Depth' button for 'The Surface' in the Depth Atlas.
        # Glide to Depth button
        elem = page.get_by_role("button", name="Glide to Depth")
        await elem.click(timeout=10000)
        
        # -> Check that the HUD depth display shows '0 m', then re-open the Milestone Atlas by clicking the 'Atlas (1)' button.
        # Atlas (1) button
        elem = page.get_by_role("button", name="Atlas (1)")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> After gliding to the discovered landmark, the HUD depth shows the landmark's saved depth (0 m).
        # Assert-outcome: passed
        # Assert: HUD depth text equals '0'.
        await expect(page.locator("#hud-depth").nth(0)).to_have_text("0", timeout=15000), "HUD depth text equals '0'."
        # Assert-outcome: passed
        # Assert: Atlas milestone entry shows depth '0 m'.
        await expect(page.locator("xpath=/html/body/div[1]/aside/div[2]/div[1]/div[1]/span").nth(0)).to_have_text("0 m", timeout=15000), "Atlas milestone entry shows depth '0 m'."
        
        # --> The Depth Atlas remains open and still shows the discovered milestone with a visible 'Glide to Depth' button.
        await page.get_by_role("button", name="Glide to Depth").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The 'Glide to Depth' button for the milestone is visible in the atlas.
        await expect(page.get_by_role("button", name="Glide to Depth").nth(0)).to_be_visible(timeout=15000), "The 'Glide to Depth' button for the milestone is visible in the atlas."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    