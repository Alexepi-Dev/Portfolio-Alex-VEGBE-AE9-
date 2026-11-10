import { describe, expect, it, vi } from 'vitest'
import { scrollToSection } from './utils'

describe('scrollToSection', () => {
  it('scrolls smoothly to an existing section', () => {
    const scrollIntoView = vi.fn()
    document.body.innerHTML = '<section id="projets"></section>'
    document.getElementById('projets').scrollIntoView = scrollIntoView

    scrollToSection('projets')

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('does nothing when the section does not exist', () => {
    document.body.innerHTML = ''
    expect(() => scrollToSection('absent')).not.toThrow()
  })
})
