import { describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import {
  caseStudyHref,
  leaveCaseStudy,
  readCaseStudySlug,
  takeReturnSection,
  useCaseStudySlug,
} from './useCaseStudyRoute'

describe('case study routes', () => {
  test('builds and parses the same hash route', () => {
    expect(caseStudyHref('meu-omni-pos')).toBe('#/work/meu-omni-pos')
    expect(readCaseStudySlug('#/work/meu-omni-pos')).toBe('meu-omni-pos')
    expect(readCaseStudySlug('#/work/meu-omni-pos/')).toBe('meu-omni-pos')
  })

  test.each(['', '#Projects', '#/work/', '#/work/a/b', '#/work/<script>'])('ignores "%s"', (hash) => {
    expect(readCaseStudySlug(hash)).toBeNull()
  })

  test('leaving a case study clears the hash and remembers where to land, once', () => {
    window.history.replaceState(null, '', '/#/work/fosco-erp')
    const onHashChange = vi.fn()
    window.addEventListener('hashchange', onHashChange)

    leaveCaseStudy('About')

    expect(window.location.hash).toBe('')
    expect(onHashChange).toHaveBeenCalledTimes(1)
    expect(takeReturnSection()).toBe('About')
    expect(takeReturnSection()).toBe('Projects')
    window.removeEventListener('hashchange', onHashChange)
  })

  test('useCaseStudySlug follows the address bar', () => {
    window.history.replaceState(null, '', '/#/work/po5-commerce')
    const { result, unmount } = renderHook(() => useCaseStudySlug())
    expect(result.current).toBe('po5-commerce')

    act(() => leaveCaseStudy())
    expect(result.current).toBeNull()

    act(() => {
      window.history.replaceState(null, '', '/#/work/fosco-erp')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(result.current).toBe('fosco-erp')
    unmount()
  })
})
