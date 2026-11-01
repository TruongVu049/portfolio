import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { findProject, PROJECTS } from './projects'
import { ABOUT, EXPERIENCE, NOTES, PROFILE, PUBLISHED_NOTES } from './profile'
import { EXPERTISE } from './expertise'
import { ProjectVisual } from '../components/projects/visuals'

// Content is data, so a typo in a slug or a missing field breaks a page silently.
// These checks catch that before it ships.

describe('projects', () => {
  test('slugs are unique and resolve with findProject', () => {
    const slugs = PROJECTS.map((p) => p.slug)

    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(findProject(slug)?.slug).toBe(slug)
    expect(findProject('does-not-exist')).toBeUndefined()
  })

  test.each(PROJECTS.map((p) => [p.slug, p]))('%s has a complete case study', (_, project) => {
    const { caseStudy } = project

    expect(project.short.length).toBeLessThanOrEqual(14) // fits the card heading on one line
    expect(caseStudy.overview).toBeTruthy()
    expect(caseStudy.role.responsibilities.length).toBeGreaterThan(0)
    expect(caseStudy.challenges.length).toBeGreaterThan(0)
    for (const c of caseStudy.challenges) expect(c.problem && c.solution).toBeTruthy()
    expect(caseStudy.results.length).toBeGreaterThanOrEqual(2) // the card shows the first two
    expect(caseStudy.learnings.length).toBeGreaterThan(0)
  })

  test.each(PROJECTS.map((p) => [p.slug, p]))('%s architecture is a list of non-empty layers', (_, project) => {
    const layers = project.caseStudy.architecture

    expect(layers.length).toBeGreaterThanOrEqual(2)
    for (const { layer, nodes } of layers) {
      expect(layer).toBeTruthy()
      expect(nodes.length).toBeGreaterThan(0)
    }
    expect(new Set(layers.map((l) => l.layer)).size).toBe(layers.length)
  })

  test.each(PROJECTS.map((p) => [p.slug, p]))('%s has an explainer visual that renders', (_, project) => {
    const { container } = render(<ProjectVisual project={project} compact />)

    expect(container.querySelector('figure')).not.toBeNull()
  })

  test('a project without a known visual renders nothing', () => {
    const { container } = render(<ProjectVisual project={{ visual: 'unknown' }} />)

    expect(container).toBeEmptyDOMElement()
  })
})

describe('profile', () => {
  test('experience, expertise and learning entries link to real projects', () => {
    const linked = [
      ...EXPERIENCE.flatMap((e) => e.projects),
      ...EXPERTISE.flatMap((g) => g.usedIn),
      ...ABOUT.learning.map((l) => l.project).filter(Boolean),
    ]

    for (const slug of linked) expect(findProject(slug), slug).toBeDefined()
  })

  test('only notes with a URL are published', () => {
    expect(PUBLISHED_NOTES).toEqual(NOTES.filter((n) => n.href))
    for (const note of PUBLISHED_NOTES) expect(note.href).toMatch(/^https:\/\//)
  })

  test('links that are filled in use https or a site path', () => {
    const urls = [PROFILE.resumeUrl, ...Object.values(PROFILE.socials)].filter(Boolean)

    for (const url of urls) expect(url).toMatch(/^(https:\/\/|\/)/)
  })
})
