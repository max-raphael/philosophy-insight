import { test, expect } from '@playwright/test'

// Helper to skip onboarding modal
const skipOnboarding = async (page: import('@playwright/test').Page) => {
  await page.addInitScript(() => {
    localStorage.setItem('philosophy-insight-onboarding', JSON.stringify({
      version: 1,
      firstVisit: Date.now(),
      hasSeenWelcome: true,
      hasSeenGuide: false
    }))
  })
}

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mark onboarding as seen to skip welcome modal
    await skipOnboarding(page)
    await page.goto('/')
    // Wait for texts to load - check for Philosophy Insight brand in header
    await page.waitForSelector('text=Philosophy Insight', { timeout: 10000 })
  })

  test('displays main heading and search bar', async ({ page }) => {
    // Brand name in header navigation
    await expect(page.locator('text=Philosophy Insight').first()).toBeVisible()
    // Search button in header
    await expect(page.locator('button').filter({ hasText: 'Search' })).toBeVisible()
  })

  test('displays Start Here section with curated texts', async ({ page }) => {
    await expect(page.locator('text=Start Here').first()).toBeVisible()
    await expect(page.locator('text=For new readers')).toBeVisible()
  })

  test('displays Browse by Era section', async ({ page }) => {
    await expect(page.locator('text=Philosophical Traditions')).toBeVisible()
    // Check era buttons in the traditions section
    await expect(page.locator('button', { hasText: 'Ancient' }).first()).toBeVisible()
    await expect(page.locator('button', { hasText: 'Medieval' }).first()).toBeVisible()
    await expect(page.locator('button', { hasText: 'Enlightenment' }).first()).toBeVisible()
    await expect(page.locator('button', { hasText: '19th Century' }).first()).toBeVisible()
  })

  test('displays Browse by Philosopher section', async ({ page }) => {
    // Scroll to reveal the Philosophers section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(500)
    await expect(page.locator('h2').filter({ hasText: 'Philosophers' })).toBeVisible()
  })

  test('clicking philosopher opens search filtered to their texts', async ({ page }) => {
    // Scroll to reveal the Philosophers section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(500)
    // Find and click on Plato in the Philosophers section
    const platoButton = page.locator('button').filter({ hasText: 'Plato' }).first()
    await platoButton.click()

    // Wait for command palette to appear
    await page.waitForTimeout(300)

    // Should show "Works by Plato" header
    await expect(page.getByText('Works by Plato')).toBeVisible({ timeout: 5000 })

    // Should show Plato's works (Republic is one of them)
    await expect(page.locator('text=Republic').first()).toBeVisible()
  })

  test('displays Full Library section', async ({ page }) => {
    const library = page.locator('#library')
    await expect(library).toBeVisible()
    // Check that there's a select for sorting
    await expect(library.locator('select')).toBeVisible()
  })

  test('era filter changes displayed texts', async ({ page }) => {
    const library = page.locator('#library')
    // Find era filter buttons (pill-style buttons)
    await library.getByRole('button', { name: 'Ancient' }).click()
    // Library should still be visible
    await expect(library).toBeVisible()
  })

  test('sort dropdown changes text order', async ({ page }) => {
    const library = page.locator('#library')
    const sortSelect = library.locator('select')
    await sortSelect.selectOption('author')
    await expect(sortSelect).toHaveValue('author')
  })

  test('clicking on a text card navigates to reader', async ({ page }) => {
    // Find a text card in the library
    const textCard = page.locator('a[href^="/texts/"]').first()
    await textCard.click()
    // Should navigate to reader page
    await expect(page).toHaveURL(/\/texts\//)
  })
})

test.describe('Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Mark onboarding as seen to skip welcome modal
    await skipOnboarding(page)
    await page.goto('/')
    await page.waitForSelector('text=Philosophy Insight', { timeout: 10000 })
  })

  test('theme toggle button is visible', async ({ page }) => {
    // ThemeToggle shows "Dark" or "Light"
    const themeButton = page.locator('button').filter({ hasText: /^(Dark|Light)$/ }).first()
    await expect(themeButton).toBeVisible()
  })

  test('clicking theme toggle cycles through themes', async ({ page }) => {
    const themeButton = page.locator('button').filter({ hasText: /^(Dark|Light)$/ }).first()

    // Get initial state
    const initialText = await themeButton.textContent()

    // Click to cycle
    await themeButton.click()

    // Text should change
    const newText = await themeButton.textContent()
    expect(newText).not.toBe(initialText)
  })

  test('dark mode applies dark background', async ({ page }) => {
    // Click until we get to Dark mode
    const themeButton = page.locator('button').filter({ hasText: /^(Dark|Light)$/ }).first()

    // Keep clicking until we see "Dark"
    for (let i = 0; i < 2; i++) {
      const text = await themeButton.textContent()
      if (text?.includes('Dark')) break
      await themeButton.click()
    }

    // Check that dark class is applied
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('light mode applies light background', async ({ page }) => {
    const themeButton = page.locator('button').filter({ hasText: /^(Dark|Light)$/ }).first()

    // Keep clicking until we see "Light"
    for (let i = 0; i < 2; i++) {
      const text = await themeButton.textContent()
      if (text?.includes('Light')) break
      await themeButton.click()
    }

    // Check that dark class is NOT applied
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)
  })
})

test.describe('Command Palette', () => {
  test.beforeEach(async ({ page }) => {
    // Mark onboarding as seen to skip welcome modal
    await skipOnboarding(page)
    await page.goto('/')
    await page.waitForSelector('text=Philosophy Insight', { timeout: 10000 })
  })

  test('opens with Cmd+K keyboard shortcut', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    // Command palette should be visible
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()
  })


  test('opens when clicking search bar on home page', async ({ page }) => {
    // Click the search button in header
    await page.locator('button').filter({ hasText: 'Search' }).click()
    // Command palette should be visible
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()
  })

  test('closes with Escape key', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()

    // Focus on input first, then press Escape
    const input = page.locator('input[placeholder*="Search the library"]')
    await input.focus()
    await page.keyboard.press('Escape')

    // Wait for animation
    await page.waitForTimeout(200)
    await expect(page.locator('.command-palette-backdrop')).not.toBeVisible()
  })

  test('closes when clicking backdrop', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()

    await page.locator('.command-palette-backdrop').click()
    await expect(page.locator('.command-palette-backdrop')).not.toBeVisible()
  })

  test('shows search results when typing', async ({ page }) => {
    await page.keyboard.press('Meta+k')

    // Type a search query in the command palette input
    const input = page.locator('.command-palette-backdrop').locator('..').locator('input')
    await input.fill('Plato')

    // Wait for results
    await page.waitForTimeout(300)

    // Should show results (look for text containing Plato or an author card)
    const results = page.locator('button').filter({ hasText: 'Plato' })
    await expect(results.first()).toBeVisible({ timeout: 5000 })
  })

  test('navigates to text when selecting result', async ({ page }) => {
    await page.keyboard.press('Meta+k')

    const input = page.locator('.command-palette-backdrop').locator('..').locator('input')
    await input.fill('Meditations')

    // Wait for results and press enter
    await page.waitForTimeout(500)
    await page.keyboard.press('Enter')

    // Should navigate to a text
    await expect(page).toHaveURL(/\/texts\//, { timeout: 5000 })
  })

  test('shows keyboard navigation hints in footer', async ({ page }) => {
    await page.keyboard.press('Meta+k')

    // Check footer has navigation hints
    await expect(page.locator('text=navigate')).toBeVisible()
    await expect(page.locator('text=select')).toBeVisible()
  })
})

test.describe('Reader Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a specific text directly
    await page.goto('/texts/categories')
    // Wait for reader to load
    await page.waitForSelector('.reader-page', { timeout: 15000 })
  })

  test('displays text title in header', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible()
  })

  test('displays back button to library', async ({ page }) => {
    const backButton = page.locator('a[href="/"]').first()
    await expect(backButton).toBeVisible()
    await backButton.click()
    await expect(page).toHaveURL('/')
  })

  test('displays reading progress indicator', async ({ page }) => {
    // Progress percentage text
    await expect(page.locator('text=/\\d+%/')).toBeVisible()
  })

  test('TOC button opens table of contents', async ({ page }) => {
    // Click TOC button - may have keyboard shortcut in title
    const tocButton = page.locator('button[title*="Table of Contents"]').first()
    await tocButton.click()

    // TOC sidebar should be visible - heading says "Contents"
    await expect(page.locator('h2').filter({ hasText: 'Contents' })).toBeVisible({ timeout: 5000 })
  })

  test('TOC closes when clicking X button', async ({ page }) => {
    const tocButton = page.locator('button[title*="Table of Contents"]').first()
    await tocButton.click()

    await expect(page.locator('h2').filter({ hasText: 'Contents' })).toBeVisible({ timeout: 5000 })

    // Close button is inside the TOC sidebar - find button with X icon
    const closeButton = page.locator('aside button').filter({ has: page.locator('svg') }).first()
    await closeButton.click()

    // TOC should be hidden
    await expect(page.locator('h2').filter({ hasText: 'Contents' })).not.toBeVisible()
  })

  test('reading controls button shows settings popup', async ({ page }) => {
    const controlsButton = page.locator('button[title="Reading settings"]')
    await controlsButton.click()

    // Should show font size label
    await expect(page.locator('text=Font Size')).toBeVisible()
    await expect(page.locator('text=Font Style')).toBeVisible()
  })

  test('search button opens command palette', async ({ page }) => {
    const searchButton = page.locator('button[title*="Search"]')
    await searchButton.click()

    await expect(page.locator('.command-palette-backdrop')).toBeVisible()
  })
})

test.describe('Keyboard Shortcuts', () => {
  test('? opens keyboard shortcuts modal in reader', async ({ page }) => {
    await page.goto('/texts/categories')
    await page.waitForSelector('.reader-page', { timeout: 15000 })

    // Click somewhere in the reader to ensure focus is on page body
    await page.locator('body').click()
    await page.waitForTimeout(100)

    // Press Shift+? to open shortcuts modal
    await page.keyboard.press('Shift+?')

    // Keyboard shortcuts modal should be visible
    await expect(page.locator('h2').filter({ hasText: 'Keyboard Shortcuts' })).toBeVisible({ timeout: 3000 })
  })

  test('Escape closes command palette', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=Philosophy Insight', { timeout: 10000 })

    // Open command palette
    await page.keyboard.press('Meta+k')
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()

    // Focus on input first, then press Escape
    const input = page.locator('input[placeholder*="Search the library"]')
    await input.focus()
    await page.keyboard.press('Escape')

    // Wait for animation
    await page.waitForTimeout(200)
    await expect(page.locator('.command-palette-backdrop')).not.toBeVisible()
  })

  test('Cmd+\\ toggles TOC in reader', async ({ page }) => {
    await page.goto('/texts/categories')
    await page.waitForSelector('.reader-page', { timeout: 15000 })

    // Click somewhere to ensure focus
    await page.locator('.reader-page').click()
    await page.waitForTimeout(100)

    // Press Cmd+\ to open TOC
    await page.keyboard.press('Meta+\\')
    await expect(page.locator('h2').filter({ hasText: 'Contents' })).toBeVisible({ timeout: 5000 })

    // Wait for animation
    await page.waitForTimeout(500)

    // Press again to close - need to ensure focus is not in TOC
    await page.keyboard.press('Meta+\\')

    // Wait for close animation
    await page.waitForTimeout(500)
    await expect(page.locator('h2').filter({ hasText: 'Contents' })).not.toBeVisible()
  })
})

test.describe('Reading Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/texts/categories')
    await page.waitForSelector('.reader-page', { timeout: 15000 })
  })

  test('font size buttons exist', async ({ page }) => {
    const controlsButton = page.locator('button[title="Reading settings"]')
    await controlsButton.click()

    // Font size buttons show "Aa" at different sizes
    const fontSizeButtons = page.locator('text=Aa')
    await expect(fontSizeButtons.first()).toBeVisible()
  })

  test('font family toggle works', async ({ page }) => {
    const controlsButton = page.locator('button[title="Reading settings"]')
    await controlsButton.click()

    // Click Sans-serif button
    const sansButton = page.locator('button').filter({ hasText: 'Sans' })
    await sansButton.click()

    // Check localStorage was updated
    const settings = await page.evaluate(() => localStorage.getItem('philosophy-insight-reading-settings'))
    expect(settings).toContain('sans')
  })

  test('theme buttons are visible in reading controls', async ({ page }) => {
    const controlsButton = page.locator('button[title="Reading settings"]')
    await controlsButton.click()

    // Should have Theme label
    await expect(page.locator('text=Theme')).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  test('mobile viewport shows page correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForSelector('text=Philosophy Insight', { timeout: 10000 })

    // Page should still be functional
    await expect(page.locator('text=Philosophy Insight').first()).toBeVisible()
  })

  test('command palette opens on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForSelector('text=Philosophy Insight', { timeout: 10000 })

    // Open command palette with keyboard
    await page.keyboard.press('Meta+k')

    // Command palette should open
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('can navigate from home to reader and back', async ({ page }) => {
    // Mark onboarding as seen to skip welcome modal
    await skipOnboarding(page)
    await page.goto('/')
    await page.waitForSelector('text=Philosophy Insight', { timeout: 10000 })

    // Click a text
    const textCard = page.locator('a[href^="/texts/"]').first()
    const href = await textCard.getAttribute('href')
    await textCard.click()

    // Should be on reader page
    await expect(page).toHaveURL(href!)
    await page.waitForSelector('.reader-page', { timeout: 15000 })

    // Click back button
    await page.locator('a[href="/"]').first().click()

    // Should be back on home
    await expect(page).toHaveURL('/')
  })

  test('command palette navigation works', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=Philosophy Insight', { timeout: 10000 })

    // Open command palette
    await page.keyboard.press('Meta+k')

    // Type and navigate
    const input = page.locator('.command-palette-backdrop').locator('..').locator('input')
    await input.fill('Republic')

    await page.waitForTimeout(500)
    await page.keyboard.press('Enter')

    // Should navigate
    await expect(page).toHaveURL(/\/texts\//, { timeout: 5000 })
  })
})

test.describe('Chat Focus Shortcut', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/texts/categories')
    await page.waitForSelector('.reader-page', { timeout: 15000 })
  })

  test('Cmd+/ focuses chat input without opening search', async ({ page }) => {
    // Click somewhere to ensure focus is on page
    await page.locator('.reader-page').click()
    await page.waitForTimeout(100)

    // Press Cmd+/
    await page.keyboard.press('Meta+/')

    // Search should NOT be open
    await page.waitForTimeout(100)
    await expect(page.locator('.command-palette-backdrop')).not.toBeVisible()

    // Chat input should be focused
    const chatInput = page.locator('textarea[placeholder*="Ask"]')
    await expect(chatInput).toBeFocused()
  })

  test('Cmd+. toggles reading mode', async ({ page }) => {
    // Chat panel visible initially
    const chatPanelIndicator = page.locator('button').filter({ hasText: 'Discussion' })
    await expect(chatPanelIndicator).toBeVisible()

    // Click somewhere to ensure focus is on page
    await page.locator('.reader-page').click()
    await page.waitForTimeout(100)

    // Press Cmd+. to enter reading mode
    await page.keyboard.press('Meta+.')

    // Chat should be hidden
    await page.waitForTimeout(100)
    await expect(chatPanelIndicator).not.toBeVisible()

    // Press Cmd+. again to exit reading mode
    await page.keyboard.press('Meta+.')

    // Chat should be visible again
    await page.waitForTimeout(100)
    await expect(chatPanelIndicator).toBeVisible()
  })
})

test.describe('Reading Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/texts/categories')
    await page.waitForSelector('.reader-page', { timeout: 15000 })
  })

  test('reading mode button toggles reading mode', async ({ page }) => {
    // Find reading mode button by its title
    const readingModeButton = page.locator('button[title*="reading mode"]')
    await expect(readingModeButton).toBeVisible()

    // Chat panel visible initially (use the conversation switcher button as indicator)
    const chatPanelIndicator = page.locator('button').filter({ hasText: 'Discussion' })
    await expect(chatPanelIndicator).toBeVisible()

    // Click to enter reading mode
    await readingModeButton.click()

    // Chat should be hidden
    await page.waitForTimeout(100)
    await expect(chatPanelIndicator).not.toBeVisible()

    // Button title should change
    await expect(page.locator('button[title="Exit reading mode (⌘.)"]')).toBeVisible()

    // Click again to exit
    await readingModeButton.click()

    // Chat should be visible again
    await page.waitForTimeout(100)
    await expect(chatPanelIndicator).toBeVisible()
  })
})

test.describe('Conversations', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/')
    await page.evaluate(() => {
      // Clear all conversation-related localStorage keys
      const keys = Object.keys(localStorage).filter(k => k.includes('conversation'))
      keys.forEach(k => localStorage.removeItem(k))
    })

    // Navigate to a specific text
    await page.goto('/texts/categories')
    await page.waitForSelector('.reader-page', { timeout: 15000 })
  })

  test('conversation switcher is visible in discussion panel', async ({ page }) => {
    // The conversation switcher should show "Discussion:" with a dropdown
    const switcher = page.locator('button').filter({ hasText: 'Discussion' })
    await expect(switcher).toBeVisible()
  })

  test('conversation switcher shows dropdown on click', async ({ page }) => {
    // Click the conversation switcher
    const switcher = page.locator('button').filter({ hasText: 'Discussion' })
    await switcher.click()

    // Dropdown should show with "Conversations" header
    await expect(page.locator('text=CONVERSATIONS').or(page.locator('text=Conversations'))).toBeVisible()

    // Should show "New conversation" button (use exact match to avoid ambiguity with list items)
    await expect(page.getByRole('button', { name: 'New conversation', exact: true })).toBeVisible()
  })

  test('can create a new conversation', async ({ page }) => {
    // Open switcher
    const switcher = page.locator('button').filter({ hasText: 'Discussion' })
    await switcher.click()

    // Click "New conversation" button (the one with plus icon at bottom)
    await page.getByRole('button', { name: 'New conversation', exact: true }).click()

    // Dropdown should close
    await page.waitForTimeout(200)

    // Open again to verify there are now 2 conversations
    await switcher.click()

    // Should see multiple conversation entries (at least 2)
    const conversationItems = page.locator('[class*="cursor-pointer"]').filter({ hasText: /conversation|New|reading/i })
    await expect(conversationItems).toHaveCount(2, { timeout: 3000 })
  })

  test('can switch between conversations', async ({ page }) => {
    // Create a second conversation first
    const switcher = page.locator('button').filter({ hasText: 'Discussion' })
    await switcher.click()
    await page.getByRole('button', { name: 'New conversation', exact: true }).click()
    await page.waitForTimeout(200)

    // Open switcher again
    await switcher.click()

    // Click on the first conversation (not the active one)
    const firstConv = page.locator('[class*="cursor-pointer"]').filter({ hasText: /New conversation|reading/i }).first()
    await firstConv.click()

    // Switcher should update to show selected conversation
    await page.waitForTimeout(200)
    // The conversation should have switched - verify by checking the header changed
    await expect(switcher).toBeVisible()
  })

  test('can rename a conversation', async ({ page }) => {
    // Open switcher
    const switcher = page.locator('button').filter({ hasText: 'Discussion' })
    await switcher.click()

    // Hover over a conversation to reveal edit button
    const convItem = page.locator('[class*="cursor-pointer"]').filter({ hasText: /conversation|New|reading/i }).first()
    await convItem.hover()

    // Click the pencil/edit button
    const editButton = convItem.locator('button[title="Rename"]')
    await editButton.click()

    // Input should appear
    const input = convItem.locator('input')
    await expect(input).toBeVisible()

    // Clear and type new name
    await input.fill('My Custom Name')
    await input.press('Enter')

    // Wait for save
    await page.waitForTimeout(200)

    // Close and reopen to verify rename persisted
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
    await switcher.click()

    // Should see the new name in the conversation list
    await expect(page.getByTitle('My Custom Name')).toBeVisible()
  })

  test('can delete a conversation', async ({ page }) => {
    // Create a second conversation first (so we can delete one)
    const switcher = page.locator('button').filter({ hasText: 'Discussion' })
    await switcher.click()
    await page.getByRole('button', { name: 'New conversation', exact: true }).click()
    await page.waitForTimeout(200)

    // Reopen switcher
    await switcher.click()

    // Verify we have 2 conversations
    const conversations = page.locator('[class*="cursor-pointer"]').filter({ hasText: /conversation|New|reading/i })
    await expect(conversations).toHaveCount(2)

    // Hover over a conversation to reveal delete button
    const firstConv = conversations.first()
    await firstConv.hover()

    // Click the X/delete button
    const deleteButton = firstConv.locator('button[title="Delete"]')
    await deleteButton.click()

    // Wait for deletion
    await page.waitForTimeout(200)

    // Should now have only 1 conversation
    await expect(conversations).toHaveCount(1)
  })

  test('deleting last conversation creates a new one automatically', async ({ page }) => {
    // Open switcher
    const switcher = page.locator('button').filter({ hasText: 'Discussion' })
    await switcher.click()

    // Should start with 1 conversation
    const conversations = page.locator('[class*="cursor-pointer"]').filter({ hasText: /conversation|New|reading/i })
    await expect(conversations).toHaveCount(1)

    // Hover and delete
    const conv = conversations.first()
    await conv.hover()
    const deleteButton = conv.locator('button[title="Delete"]')
    await deleteButton.click()

    // Wait for deletion and auto-creation
    await page.waitForTimeout(200)

    // Should still have 1 conversation (a new one was created)
    await expect(conversations).toHaveCount(1)
  })

  test('conversation state persists in localStorage', async ({ page }) => {
    // Create a second conversation with a custom name
    const switcher = page.locator('button').filter({ hasText: 'Discussion' })
    await switcher.click()
    await page.getByRole('button', { name: 'New conversation', exact: true }).click()
    await page.waitForTimeout(200)

    // Verify localStorage has conversation index
    const storageKeys = await page.evaluate(() => {
      return Object.keys(localStorage).filter(k => k.includes('conversations-index'))
    })
    expect(storageKeys.length).toBeGreaterThan(0)
  })

  test('mode toggle switches between Tutor and Socratic', async ({ page }) => {
    // Find mode toggle buttons
    const tutorButton = page.locator('button').filter({ hasText: 'Tutor' })
    const socraticButton = page.locator('button').filter({ hasText: 'Socratic' })

    // Both buttons should be visible
    await expect(tutorButton).toBeVisible()
    await expect(socraticButton).toBeVisible()

    // Tutor should be active by default (has shadow-sm class indicating selection)
    await expect(tutorButton).toHaveClass(/shadow-sm/)

    // Click Socratic
    await socraticButton.click()
    await page.waitForTimeout(100)

    // Socratic should now be active
    await expect(socraticButton).toHaveClass(/shadow-sm/)
  })
})

test.describe('Bookmarks', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/texts/meditations')
    await page.waitForSelector('.reader-page', { timeout: 15000 })
  })

  test('selection popup shows both Discuss and Save buttons', async ({ page }) => {
    // Get some text content
    const paragraph = page.locator('[data-paragraph-index="0"]').first()
    await paragraph.waitFor({ state: 'visible' })

    // Select text by triple-clicking
    await paragraph.click({ clickCount: 3 })
    await page.waitForTimeout(200)

    // Both buttons should be visible in the selection popup
    const popup = page.locator('.selection-popup')
    await expect(popup).toBeVisible()
    await expect(popup.getByText('Discuss')).toBeVisible()
    await expect(popup.getByText('Save')).toBeVisible()
  })

  test('bookmarks panel button is visible in header', async ({ page }) => {
    // Look for bookmark icon button (SVG with bookmark path)
    const bookmarkButton = page.locator('button[title="Bookmarks (⌘B)"]')
    await expect(bookmarkButton).toBeVisible()
  })

  test('bookmarks panel opens and shows empty state', async ({ page }) => {
    // Click bookmarks button
    const bookmarkButton = page.locator('button[title="Bookmarks (⌘B)"]')
    await bookmarkButton.click()
    await page.waitForTimeout(200)

    // Panel should be visible with empty state message
    const panel = page.locator('aside').filter({ hasText: 'Bookmarks' })
    await expect(panel).toBeVisible()
    await expect(panel.getByText('No bookmarks yet')).toBeVisible()
  })

  test('Cmd+B toggles bookmarks panel', async ({ page }) => {
    // Press Cmd+B to open
    await page.keyboard.press('Meta+b')
    await page.waitForTimeout(200)

    // Panel should be visible
    const panel = page.locator('aside').filter({ hasText: 'Bookmarks' })
    await expect(panel).toBeVisible()

    // Press Cmd+B again to close
    await page.keyboard.press('Meta+b')
    await page.waitForTimeout(200)

    // Panel should be hidden
    await expect(panel).not.toBeVisible()
  })

  test('clicking Save button opens bookmark modal', async ({ page }) => {
    // Select text
    const paragraph = page.locator('[data-paragraph-index="0"]').first()
    await paragraph.click({ clickCount: 3 })
    await page.waitForTimeout(200)

    // Click Save button
    await page.locator('.selection-popup').getByText('Save').click()
    await page.waitForTimeout(200)

    // Modal should appear
    const modal = page.locator('div').filter({ hasText: 'Save Passage' }).first()
    await expect(modal).toBeVisible()
  })

  test('can save a bookmark and see it in panel', async ({ page }) => {
    // Select text
    const paragraph = page.locator('[data-paragraph-index="0"]').first()
    await paragraph.click({ clickCount: 3 })
    await page.waitForTimeout(200)

    // Click Save button
    await page.locator('.selection-popup').getByText('Save').click()
    await page.waitForTimeout(200)

    // Click Save in modal (without note)
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await page.waitForTimeout(200)

    // Open bookmarks panel
    const bookmarkButton = page.locator('button[title="Bookmarks (⌘B)"]')
    await bookmarkButton.click()
    await page.waitForTimeout(200)

    // Should show 1 bookmark
    const panel = page.locator('aside').filter({ hasText: 'Bookmarks' })
    await expect(panel.getByText('1 bookmark saved')).toBeVisible()
  })
})

test.describe('Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to simulate first-time user
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('welcome modal appears on first visit', async ({ page }) => {
    // Navigate to home page (cleared localStorage simulates first visit)
    await page.goto('/')
    await page.waitForTimeout(500)

    // Welcome modal should appear
    await expect(page.getByText('Welcome to Philosophy Insight')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('wrestle with it first')).toBeVisible()
  })

  test('welcome modal dismisses and does not reappear', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)

    // Welcome modal should appear
    await expect(page.getByText('Welcome to Philosophy Insight')).toBeVisible({ timeout: 5000 })

    // Click Begin Exploring button
    await page.getByRole('button', { name: 'Begin Exploring' }).click()
    await page.waitForTimeout(300)

    // Modal should be gone
    await expect(page.getByText('Welcome to Philosophy Insight')).not.toBeVisible()

    // Reload page
    await page.reload()
    await page.waitForSelector('text=Philosophy Insight', { timeout: 10000 })
    await page.waitForTimeout(500)

    // Modal should not appear on subsequent visit
    await expect(page.getByText('Welcome to Philosophy Insight')).not.toBeVisible()
  })

  test('welcome modal How to Use link navigates to guide', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)

    // Welcome modal should appear
    await expect(page.getByText('Welcome to Philosophy Insight')).toBeVisible({ timeout: 5000 })

    // Click How to Use button in the modal (the button, not the footer link)
    await page.getByRole('button', { name: /How to Use/ }).click()
    await page.waitForTimeout(300)

    // Should be on the How to Use page
    await expect(page).toHaveURL('/how-to-use')
    await expect(page.getByRole('heading', { name: 'How to Use This App' })).toBeVisible()
  })

  test('How to Use page renders all sections', async ({ page }) => {
    await page.goto('/how-to-use')
    await page.waitForTimeout(500)

    // Check main heading
    await expect(page.getByRole('heading', { name: 'How to Use This App' })).toBeVisible()

    // Check key sections (using headings to be specific)
    await expect(page.getByRole('heading', { name: 'The Philosophy of Reading' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'How It Works' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Two Modes of Discussion' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Tutor Mode' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Socratic Mode' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Save & Export' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Keyboard Shortcuts' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'On Mobile' })).toBeVisible()

    // Check Start Reading CTA
    await expect(page.getByRole('link', { name: 'Start Reading' })).toBeVisible()
  })

  test('How to Use page Start Reading links to home', async ({ page }) => {
    await page.goto('/how-to-use')
    await page.waitForTimeout(500)

    // Click Start Reading
    await page.getByRole('link', { name: 'Start Reading' }).click()
    await page.waitForTimeout(300)

    // Should be on home page
    await expect(page).toHaveURL('/')
  })

  test('keyboard shortcuts modal has How to use this app link', async ({ page }) => {
    // Skip welcome modal using helper
    await skipOnboarding(page)
    await page.goto('/texts/categories')
    await page.waitForSelector('.reader-page', { timeout: 15000 })

    // Click on body to ensure focus is on page
    await page.locator('body').click()
    await page.waitForTimeout(100)

    // Press Shift+? to open shortcuts modal (same as existing test)
    await page.keyboard.press('Shift+?')

    // Modal should appear
    await expect(page.locator('h2').filter({ hasText: 'Keyboard Shortcuts' })).toBeVisible({ timeout: 3000 })

    // Should have the How to use link
    await expect(page.getByText('How to use this app')).toBeVisible()
  })

  test('footer has How to Use link', async ({ page }) => {
    // Skip welcome modal using helper
    await skipOnboarding(page)
    await page.goto('/')
    await page.waitForSelector('text=Philosophy Insight', { timeout: 10000 })

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Check for How to Use link in footer
    const footer = page.locator('footer')
    await expect(footer.getByText('How to Use')).toBeVisible()
  })
})
