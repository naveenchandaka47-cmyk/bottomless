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
        
        # -> Click the 'Sound' button in the bottom dock to open the sound popover.
        # Sound button
        elem = page.get_by_role("button", name="Sound")
        await elem.click(timeout=10000)
        
        # -> Click the 'Mute Audio' button in the Harmonic Soundscape popover to mute audio, then close the popover using the 'Close' button.
        # Mute Audio button
        elem = page.get_by_role("button", name="Mute Audio")
        await elem.click(timeout=10000)
        
        # -> Click the 'Mute Audio' button in the Harmonic Soundscape popover to mute audio, then close the popover using the 'Close' button.
        # Close button
        elem = page.get_by_role("button", name="Close")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The Sound control indicates audio is muted via its button title.
        # Assert-outcome: passed
        # Assert: The Sound button's title indicates the audio is muted.
        await expect(page.get_by_role("button", name="Sound").nth(0)).to_have_attribute("title", "108Hz Harmonic Ambient Drone (M) - Click to un-mute / configure", timeout=15000), "The Sound button's title indicates the audio is muted."
        
        # --> The dock controls remain accessible (example: the 'Float' button is visible).
        # Assert-outcome: passed
        # Assert: The 'Float' dock button is visible, showing dock controls are accessible.
        await expect(page.locator("#btn-float").nth(0)).to_have_text("Float", timeout=15000), "The 'Float' dock button is visible, showing dock controls are accessible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    