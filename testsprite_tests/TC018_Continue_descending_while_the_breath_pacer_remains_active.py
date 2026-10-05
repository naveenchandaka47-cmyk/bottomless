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
        
        # -> Click the 'Breathe' button to open the Mindful Breath Pacer, then scroll downward to descend and verify the pacer stays visible while descent continues.
        # Breathe button
        elem = page.get_by_role("button", name="Breathe")
        await elem.click(timeout=10000)
        
        # -> Click the 'Breathe' button to open the Mindful Breath Pacer, then scroll downward to descend and verify the pacer stays visible while descent continues.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll the page downward and check that the 'Inhale gently...' breath pacer overlay remains visible while the depth indicator increases (descent continues).
        await page.mouse.wheel(0, 300)
        
        # --> Assertions to verify final state
        
        # --> The Mindful Breath Pacer overlay remains visible showing the pacer text and rhythm.
        # Assert-outcome: passed
        # Assert: The pacer overlay displays the rhythm text '5.5s Resonant Rhythm'.
        await expect(page.locator("body").nth(0)).to_contain_text("5.5s Resonant Rhythm", timeout=15000), "The pacer overlay displays the rhythm text '5.5s Resonant Rhythm'."
        
        # --> The descent HUD continues updating while the pacer is open (depth indicator visible).
        # Assert-outcome: passed
        # Assert: The HUD numeric depth readout shows '3', indicating descent progressed.
        await expect(page.locator("#hud-depth").nth(0)).to_have_text("3", timeout=15000), "The HUD numeric depth readout shows '3', indicating descent progressed."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    