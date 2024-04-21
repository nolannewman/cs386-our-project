import asyncio
from pyppeteer import launch
from dotenv import load_dotenv
import os

dotenv_path = '.env'
load_dotenv(dotenv_path=dotenv_path)

BASE_URL = 'http://0.0.0.0:3000'

async def login(page):
    print("Navigated to the login page.")
    await page.goto(f'{BASE_URL}/login')
    await page.waitForSelector('#username', {'visible': True})
    await page.type('#username', os.getenv('TEST_USER'))
    print("Username entered.")

    await page.waitForSelector('#password', {'visible': True})
    await page.type('#password', os.getenv('TEST_PWD'))
    print("Password entered.")

    navigationPromise = asyncio.ensure_future(page.waitForNavigation())
    await page.click('button[type="submit"]')
    await navigationPromise
    print("Login button clicked and navigation detected.")

    current_url = page.url
    if current_url == BASE_URL + '/':
        print("Redirection to homepage confirmed, login successful.")
    else:
        print(f"Unexpected URL post-login: {current_url}")
    return True

async def add_food_item(page):
    await page.goto(f'{BASE_URL}/foodlog')
    print("Adding food item.")
    await page.waitForSelector('#food_name', {'visible': True})
    await page.type('#food_name', 'Banana')
    print("Food name entered.")

    await page.waitForSelector('#calories_eaten', {'visible': True})
    await page.type('#calories_eaten', '200')
    print("Calories entered.")

    await page.waitForSelector('#food_desc', {'visible': True})
    await page.type('#food_desc', 'Delicious and nutritious.')
    print("Description entered.")

    await page.click('button[type="submit"]')
    print("Food item submitted.")

async def check_dashboard_metrics(page):
    await page.goto(f'{BASE_URL}/dashboard')
    print("Navigated to the dashboard.")

    await page.waitForXPath('//h3[contains(text(), "Daily Progress")]/following-sibling::p')
    await page.waitForXPath('//h3[contains(text(), "Calories consumed")]/following-sibling::p')

    daily_progress = await page.evaluate('''() => document.querySelector('h3:nth-of-type(5) + p').innerText''')
    print(f"Daily Progress: {daily_progress}")

    calories_consumed = await page.evaluate('''() => document.querySelector('h3:nth-of-type(4) + p').innerText''')
    if calories_consumed.strip() == '200':
        print("Calories consumed is correctly recorded as 200.")
    else:
        print(f"Calories consumed is recorded as {calories_consumed}, but expected 100.")

async def logout(page):
    await page.goto(f'{BASE_URL}/')
    print("Logging out.")
    await page.waitForSelector('form[action="/logout?_method=DELETE"] button', {'visible': True})
    logoutButtonPromise = asyncio.ensure_future(page.waitForNavigation())
    await page.click('form[action="/logout?_method=DELETE"] button')
    await logoutButtonPromise
    print("Logout button clicked and navigation detected.")

async def test_login():
    try:
        browser = await launch(headless=True, args=['--no-sandbox'])
        page = await browser.newPage()

        loginFlag = await login(page)
        if(loginFlag):
            await add_food_item(page)
            await check_dashboard_metrics(page)
            await logout(page)

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        await browser.close()
        print("Browser closed.")

asyncio.run(test_login())
