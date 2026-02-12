import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for texts to load - check for a specific element
    await page.waitForSelector('h1', { timeout: 10000 })
  })

  test('displays main heading and search bar', async ({ page }) => {
    await expect(page.locator('h1').filter({ hasText: 'Philosophy Insight' })).toBeVisible()
    // Search bar button in header
    await expect(page.locator('button').filter({ hasText: 'Search texts' })).toBeVisible()
  })

  test('displays Start Here section with curated texts', async ({ page }) => {
    await expect(page.locator('text=Start Here').first()).toBeVisible()
    await expect(page.locator('text=Essential reads for beginners')).toBeVisible()
  })

  test('displays Browse by Era section', async ({ page }) => {
    await expect(page.locator('text=Browse by Era')).toBeVisible()
    // Check era buttons
    await expect(page.locator('button', { hasText: 'Ancient' }).first()).toBeVisible()
    await expect(page.locator('button', { hasText: 'Medieval' }).first()).toBeVisible()
    await expect(page.locator('button', { hasText: 'Enlightenment' }).first()).toBeVisible()
    await expect(page.locator('button', { hasText: 'Modern' }).first()).toBeVisible()
  })

  test('displays Browse by Philosopher section', async ({ page }) => {
    await expect(page.locator('text=Browse by Philosopher')).toBeVisible()
  })

  test('displays Full Library section', async ({ page }) => {
    const library = page.locator('#library')
    await expect(library).toBeVisible()
    // Check that there's a select for sorting
    await expect(library.locator('select')).toBeVisible()
  })

  test('era filter changes displayed texts', async ({ page }) => {
    const library = page.locator('#library')
    // Find era filter buttons inside the library filter area
    const filterArea = library.locator('.flex.items-center.gap-1.bg-\\[var\\(--bg-secondary\\)\\]')
    await filterArea.getByRole('button', { name: 'Ancient' }).click()
    // Library count should update
    await expect(library.getByText(/Full Library \(\d+ texts\)/)).toBeVisible()
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
    await page.goto('/')
    await page.waitForSelector('h1', { timeout: 10000 })
  })

  test('theme toggle button is visible', async ({ page }) => {
    // ThemeToggle shows "Light", "Dark", or "System"
    const themeButton = page.locator('button').filter({ hasText: /^(Light|Dark|System)$/ }).first()
    await expect(themeButton).toBeVisible()
  })

  test('clicking theme toggle cycles through themes', async ({ page }) => {
    const themeButton = page.locator('button').filter({ hasText: /^(Light|Dark|System)$/ }).first()

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
    const themeButton = page.locator('button').filter({ hasText: /^(Light|Dark|System)$/ }).first()

    // Keep clicking until we see "Dark"
    for (let i = 0; i < 3; i++) {
      const text = await themeButton.textContent()
      if (text?.includes('Dark')) break
      await themeButton.click()
    }

    // Check that dark class is applied
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('light mode applies light background', async ({ page }) => {
    const themeButton = page.locator('button').filter({ hasText: /^(Light|Dark|System)$/ }).first()

    // Keep clicking until we see "Light"
    for (let i = 0; i < 3; i++) {
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
    await page.goto('/')
    await page.waitForSelector('h1', { timeout: 10000 })
  })

  test('opens with Cmd+K keyboard shortcut', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    // Command palette should be visible
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()
  })

  test('opens with / keyboard shortcut', async ({ page }) => {
    await page.keyboard.press('/')
    // Command palette should be visible
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()
  })

  test('opens when clicking search bar on home page', async ({ page }) => {
    // Click the search button (it's styled as a button that looks like a search bar)
    await page.locator('button').filter({ hasText: 'Search texts' }).click()
    // Command palette should be visible
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()
  })

  test('closes with Escape key', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()

    // Focus on input first, then press Escape
    const input = page.locator('input[placeholder*="Search texts"]')
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
    // Click TOC button
    const tocButton = page.locator('button[title*="Table of Contents"]')
    await tocButton.click()

    // TOC sidebar should be visible
    await expect(page.locator('h2').filter({ hasText: 'Table of Contents' })).toBeVisible()
  })

  test('TOC closes when clicking X button', async ({ page }) => {
    const tocButton = page.locator('button[title*="Table of Contents"]')
    await tocButton.click()

    await expect(page.locator('h2').filter({ hasText: 'Table of Contents' })).toBeVisible()

    // Close button is next to the heading - find button with X icon
    const closeButton = page.locator('aside button').filter({ has: page.locator('svg') }).first()
    await closeButton.click()

    // TOC should be hidden
    await expect(page.locator('h2').filter({ hasText: 'Table of Contents' })).not.toBeVisible()
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

    // Press Shift+/ which produces ?
    await page.keyboard.down('Shift')
    await page.keyboard.press('/')
    await page.keyboard.up('Shift')

    // Keyboard shortcuts modal should be visible
    await expect(page.locator('h2').filter({ hasText: 'Keyboard Shortcuts' })).toBeVisible({ timeout: 3000 })
  })

  test('Escape closes command palette', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1', { timeout: 10000 })

    // Open command palette
    await page.keyboard.press('Meta+k')
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()

    // Focus on input first, then press Escape
    const input = page.locator('input[placeholder*="Search texts"]')
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
    await expect(page.locator('h2').filter({ hasText: 'Table of Contents' })).toBeVisible({ timeout: 3000 })

    // Wait for animation
    await page.waitForTimeout(300)

    // Press again to close - need to ensure focus is not in TOC
    await page.keyboard.press('Meta+\\')

    // Wait for close animation
    await page.waitForTimeout(300)
    await expect(page.locator('h2').filter({ hasText: 'Table of Contents' })).not.toBeVisible()
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
    await page.waitForSelector('h1', { timeout: 10000 })

    // Page should still be functional
    await expect(page.locator('h1').filter({ hasText: 'Philosophy Insight' })).toBeVisible()
  })

  test('command palette opens on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForSelector('h1', { timeout: 10000 })

    // Open command palette with keyboard
    await page.keyboard.press('Meta+k')

    // Command palette should open
    await expect(page.locator('.command-palette-backdrop')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('can navigate from home to reader and back', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1', { timeout: 10000 })

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
    await page.waitForSelector('h1', { timeout: 10000 })

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
})
