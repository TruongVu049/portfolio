import { useEffect, useState } from 'react'

// Case studies live at #/work/<slug>: a hash route works on any static host
// without rewrite rules, and the home page needs no router at all.
const CASE_STUDY_PATTERN = /^#\/work\/([\w-]+)\/?$/
const DEFAULT_RETURN_SECTION = 'Projects'

let returnSectionId = null

export const caseStudyHref = (slug) => `#/work/${slug}`

/** @returns {string | null} slug of the case study in the URL, if any */
export function readCaseStudySlug(hash = window.location.hash) {
  return hash.match(CASE_STUDY_PATTERN)?.[1] ?? null
}

/** Current case-study slug, kept in sync with the address bar. */
export function useCaseStudySlug() {
  const [slug, setSlug] = useState(() => readCaseStudySlug())
  useEffect(() => {
    const onHashChange = () => setSlug(readCaseStudySlug())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return slug
}

/** Go back to the home page and land on `sectionId` once it has rendered. */
export function leaveCaseStudy(sectionId = DEFAULT_RETURN_SECTION) {
  returnSectionId = sectionId
  window.history.pushState(null, '', window.location.pathname + window.location.search)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

/** Section to show after leaving a case study (browser back included). Read once. */
export function takeReturnSection() {
  const id = returnSectionId ?? DEFAULT_RETURN_SECTION
  returnSectionId = null
  return id
}
