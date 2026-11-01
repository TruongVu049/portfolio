import { useEffect, useRef } from 'react'
import { jumpTo, useLenis } from './hooks/useLenis'
import { takeReturnSection, useCaseStudySlug } from './hooks/useCaseStudyRoute'
import { useTheme } from './context/ThemeContext'
import { PROFILE, PUBLISHED_NOTES } from './data/profile'
import { findProject } from './data/projects'
import StaggeredMenu from './components/layout/StaggeredMenu'
import ThemeToggle from './components/layout/ThemeToggle'
import Hero from './components/hero/Hero'
import Projects from './components/projects/Projects'
import CaseStudy from './components/projects/CaseStudy'
import Skills from './components/skills/Skills'
import CurvedMarquee from './components/marquee/CurvedMarquee'
import Experience from './components/experience/Experience'
import About from './components/about/About'
import Notes from './components/notes/Notes'
import Contact from './components/contact/Contact'
import Footer from './components/footer/Footer'

const HAS_NOTES = PUBLISHED_NOTES.length > 0

const NAV_ITEMS = [
  { label: 'Home', target: 'Home' },
  { label: 'Projects', target: 'Projects' },
  { label: 'Skills', target: 'Expertise' },
  { label: 'Career', target: 'Experience' },
  { label: 'About', target: 'About' },
  HAS_NOTES && { label: 'Notes', target: 'Notes' },
  { label: 'Contact', target: 'Contact' },
].filter(Boolean)

const SOCIAL_ITEMS = [
  { label: 'Résumé', href: PROFILE.resumeUrl },
  { label: 'GitHub', href: PROFILE.socials.github },
  { label: 'LinkedIn', href: PROFILE.socials.linkedin },
].filter((social) => social.href)

function HomePage() {
  return (
    <main>
      <Hero />
      <Projects />
      <Skills />
      <CurvedMarquee />
      <Experience />
      <About />
      {HAS_NOTES && <Notes />}
      <Contact index={HAS_NOTES ? '06' : '05'} />
    </main>
  )
}

/** Opens case studies at the top and returns to the right home section afterwards. */
function useRouteScroll(project) {
  const wasCaseStudy = useRef(false)
  useEffect(() => {
    if (project) {
      wasCaseStudy.current = true
      jumpTo()
      return
    }
    if (!wasCaseStudy.current) return
    wasCaseStudy.current = false
    const sectionId = takeReturnSection()
    // Wait one frame so the home sections exist before measuring them.
    const frame = requestAnimationFrame(() => jumpTo(sectionId))
    return () => cancelAnimationFrame(frame)
  }, [project])
}

export default function App() {
  useLenis()
  const { theme } = useTheme()
  const project = findProject(useCaseStudySlug())
  useRouteScroll(project)

  return (
    <div className="min-h-screen overflow-x-clip bg-black text-white">
      <ThemeToggle />
      <StaggeredMenu
        items={NAV_ITEMS}
        socials={SOCIAL_ITEMS}
        buttonColor={theme === 'light' ? '#0b1220' : '#ffffff'}
      />
      {project ? <CaseStudy project={project} /> : <HomePage />}
      <Footer navItems={NAV_ITEMS} />
    </div>
  )
}
