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
        
        # -> Scroll down to descend (use the page's 'Scroll or drag to descend' action).
        await page.mouse.wheel(0, 300)
        
        # -> Scroll down to descend (use the page's 'Scroll or drag to descend' action).
        await page.mouse.wheel(0, 300)
        
        # -> Scroll down to descend (use the page's 'Scroll or drag to descend' action).
        # 0 m
        elem = page.get_by_text("0 m", exact=True)
        await elem.click(timeout=10000)
        
        # -> Scroll down once more to increase depth, then click the central 'The Surface' area to activate the surface control.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll down once more to increase depth, then click the central 'The Surface' area to activate the surface control.
        # 0 m
        elem = page.get_by_text("0 m", exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'The Surface' control and verify the HUD depth returns to 0 m (surface).
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'The Surface' control and verify the HUD depth returns to 0 m (surface).
        # 0 m
        elem = page.get_by_text("0 m", exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'The Surface' central control to trigger the glide back toward the surface.
        # 0 m
        elem = page.get_by_text("0 m", exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the central 'The Surface' control to trigger a glide back toward the surface, then check the HUD depth.
        # 0 m
        elem = page.get_by_text("0 m", exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Clicking the 'The Surface' control did not glide the scene back to the surface; the HUD depth did not reach 0 m.
        # Assert-outcome: failed
        # Assert: Expected the HUD depth to read '0' after activating the surface control.
        await expect(page.locator("#hud-depth").nth(0)).to_have_text("0", timeout=15000), "Expected the HUD depth to read '0' after activating the surface control."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    