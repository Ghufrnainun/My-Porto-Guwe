"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ArrowUpRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export interface Project {
  title: string
  description: string
  year: string
  link: string
  image: string
}

const defaultProjects: Project[] = [
  {
    title: "TempeMail",
    description: "Disposable email service that runs entirely on Cloudflare Workers. Multi-domain, REST API, webhooks, and MCP server.",
    year: "2026",
    link: "/projects/tempe-mail",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "SewaInAja",
    description: "Rental platform spanning a Flutter mobile experience and a Next.js 16 admin surface with Firebase & Midtrans.",
    year: "2026",
    link: "/projects/sewainaja",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "LSP Polines",
    description: "Certification website developed with a five-person team, with ownership across authentication and collaborative Git workflow.",
    year: "2025",
    link: "/projects/lsp-polines",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "IMPP Organization",
    description: "Official student organization platform with content management, dynamic event publishing, and community engagement.",
    year: "2025",
    link: "/projects/impp",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop",
  },
]

interface ProjectShowcaseProps {
  projects?: Project[]
  className?: string
  showTitle?: boolean
}

export function ProjectShowcase({
  projects = defaultProjects,
  className = "",
  showTitle = true,
}: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isVisible) return

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      setSmoothPosition((prev) => {
        const dx = Math.abs(prev.x - mousePosition.x)
        const dy = Math.abs(prev.y - mousePosition.y)
        if (dx < 0.1 && dy < 0.1) return prev
        return {
          x: lerp(prev.x, mousePosition.x, 0.15),
          y: lerp(prev.y, mousePosition.y, 0.15),
        }
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible, mousePosition])

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    })
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  const handleProjectClick = (e: React.MouseEvent, link: string) => {
    if (link.startsWith("/")) {
      e.preventDefault()
      navigate(link)
    }
  }

  // Prevent preview card from overflowing right side of screen
  const isNearRightEdge = typeof window !== "undefined" && smoothPosition.x > window.innerWidth - 400
  const transformX = isNearRightEdge ? smoothPosition.x - 380 : smoothPosition.x + 28
  const transformY = smoothPosition.y - 120

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full ${className}`}
    >
      {showTitle && (
        <h2 className="text-muted-foreground text-xs font-mono font-medium tracking-widest uppercase mb-8">
          Selected Work
        </h2>
      )}

      {/* Floating Hover Image Preview (Desktop only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 overflow-hidden rounded-2xl shadow-2xl hidden md:block will-change-transform"
        style={{
          transform: `translate3d(${transformX}px, ${transformY}px, 0)`,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.85,
          transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), scale 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative w-[340px] lg:w-[380px] h-[215px] lg:h-[240px] bg-secondary rounded-2xl overflow-hidden border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
          {projects.map((project, index) => (
            <img
              key={project.title}
              src={project.image || "/placeholder.svg"}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
                scale: hoveredIndex === index ? 1 : 1.08,
                filter: hoveredIndex === index ? "none" : "blur(12px)",
              }}
            />
          ))}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
        </div>
      </div>

      <div className="w-full space-y-0">
        {projects.map((project, index) => (
          <a
            key={project.title}
            href={project.link}
            onClick={(e) => handleProjectClick(e, project.link)}
            className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative py-7 sm:py-9 border-t border-border/60 transition-all duration-300 ease-out">
              {/* Background highlight on hover */}
              <div
                className={`
                  absolute inset-0 -mx-3 sm:-mx-4 px-3 sm:px-4 bg-secondary/35 rounded-2xl
                  transition-all duration-300 ease-out pointer-events-none
                  ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-98"}
                `}
              />

              <div className="relative flex items-start justify-between gap-6 sm:gap-10">
                <div className="flex-1 min-w-0">
                  {/* Title with animated underline */}
                  <div className="inline-flex items-center gap-2.5">
                    <h3 className="text-foreground font-serif font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight">
                      <span className="relative">
                        {project.title}
                        {/* Animated underline */}
                        <span
                          className={`
                            absolute left-0 -bottom-1 h-[1.5px] bg-foreground
                            transition-all duration-300 ease-out
                            ${hoveredIndex === index ? "w-full" : "w-0"}
                          `}
                        />
                      </span>
                    </h3>

                    {/* Arrow that slides in */}
                    <ArrowUpRight
                      aria-hidden="true"
                      className={`
                        size-4 sm:size-5 text-muted-foreground
                        transition-all duration-300 ease-out
                        ${
                          hoveredIndex === index
                            ? "opacity-100 translate-x-0 translate-y-0 text-foreground"
                            : "opacity-0 -translate-x-2 translate-y-2"
                        }
                      `}
                    />
                  </div>

                  {/* Description with fade effect */}
                  <p
                    className={`
                      text-muted-foreground text-sm sm:text-base mt-2 sm:mt-2.5 max-w-2xl leading-relaxed font-sans
                      transition-all duration-300 ease-out
                      ${hoveredIndex === index ? "text-foreground/85" : "text-muted-foreground"}
                    `}
                  >
                    {project.description}
                  </p>
                </div>

                {/* Year badge */}
                <span
                  className={`
                    text-xs sm:text-sm font-mono text-muted-foreground/80 tabular-nums shrink-0 pt-2
                    transition-all duration-300 ease-out
                    ${hoveredIndex === index ? "text-foreground font-semibold" : ""}
                  `}
                >
                  {project.year}
                </span>
              </div>
            </div>
          </a>
        ))}

        {/* Bottom border for last item */}
        <div className="border-t border-border/60" />
      </div>
    </section>
  )
}
