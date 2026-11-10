import { afterEach, describe, expect, it, vi } from 'vitest'
import { scrollToSection } from './utils'

afterEach(() => {
  document.body.replaceChildren()
})

describe('scrollToSection', () => {
  it('scrolls smoothly to an existing section', () => {
    const scrollIntoView = vi.fn()
    const section = document.createElement('section')
    section.id = 'projets'
    section.scrollIntoView = scrollIntoView
    document.body.append(section)

    scrollToSection('projets')

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('does nothing when the section does not exist', () => {
    expect(() => scrollToSection('absent')).not.toThrow()
  })
})
