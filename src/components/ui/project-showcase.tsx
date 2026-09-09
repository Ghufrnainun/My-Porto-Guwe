"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

export interface Project {
  title: string
  description: string
  year: string
  link: string
  image: string
  tags?: string[]
}

export const defaultProjects: Project[] = [
  {
    title: "TempeMail",
    description: "Disposable email service that runs entirely on Cloudflare Workers. Multi-domain, REST API, webhooks, and MCP server.",
    year: "2026",
    link: "/projects/tempe-mail",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop",
    tags: ["Cloudflare Workers", "REST API", "MCP Server"],
  },
  {
    title: "SewaInAja",
    description: "Rental platform spanning a Flutter mobile experience and a Next.js 16 admin surface with Firebase & Midtrans.",
    year: "2026",
    link: "/projects/sewainaja",
    image: "/sewainaja.png",
    tags: ["Flutter", "Next.js 16", "Midtrans"],
  },
  {
    title: "LSP Polines",
    description: "Certification website developed with a five-person team, with ownership across authentication and collaborative Git workflow.",
    year: "2025",
    link: "/projects/lsp-polines",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
    tags: ["Team Collab", "Auth Architecture", "Git"],
  },
  {
    title: "IMPP Organization",
    description: "Official student organization platform with content management, dynamic event publishing, and community engagement.",
    year: "2025",
    link: "/projects/impp-website",
    image: "/impp-screenshot.png",
    tags: ["Content CMS", "Event Publishing", "Community"],
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
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  // Hardware-accelerated fluid spring physics (Emil Kowalski standard)
  const mouseY = useMotionValue(-1000)
  const springConfig = { damping: 28, stiffness: 320, mass: 0.35 }
  const smoothY = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseY.set(e.clientY)
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

      {/* 
        Liquid Glass Project Preview (Desktop Right Stage)
        Anchored on the right side of the section, gliding vertically with spring physics.
        This guarantees the preview NEVER overlaps the title, tags, or description on the left!
      */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-40 hidden md:block will-change-transform"
        style={{
          top: 0,
          right: 'max(1.5rem, calc((100vw - 1280px) / 2 + 2.5rem))',
          y: smoothY,
        }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isVisible ? 1 : 0,
            scale: isVisible ? 1 : 0.94,
            y: -110,
          }}
          transition={{
            opacity: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
          }}
          className="w-[360px] lg:w-[410px] aspect-[16/10] p-2 rounded-2xl bg-neutral-900/70 dark:bg-black/75 border border-border/80 dark:border-white/20 backdrop-blur-2xl shadow-[0_25px_70px_-10px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.2)]"
        >
          {/* Double-bezel inner core */}
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] bg-neutral-950">
            {projects.map((project, index) => (
              <img
                key={project.title}
                src={project.image || "/placeholder.svg"}
                alt=""
                loading="eager"
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-out",
                  hoveredIndex === index
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                )}
              />
            ))}

            {/* Specular glass reflection sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />

            {/* Micro glass badge */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-widest uppercase text-white/95 shadow-sm flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span>
                {hoveredIndex !== null ? projects[hoveredIndex]?.year : "Preview"}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Project list with Luxury Editorial Focus Dimming */}
      <div className="w-full space-y-0">
        {projects.map((project, index) => {
          const isCurrentHovered = hoveredIndex === index
          const isOtherHovered = hoveredIndex !== null && !isCurrentHovered

          return (
            <motion.div
              key={project.title}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.75,
                delay: shouldReduceMotion ? 0 : index * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                "will-change-[transform,opacity,filter] transition-opacity duration-300 ease-out",
                isOtherHovered ? "opacity-35" : "opacity-100"
              )}
            >
              <a
                href={project.link}
                onClick={(e) => handleProjectClick(e, project.link)}
                className="group block rounded-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background active:scale-[0.99] transition-transform duration-150"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative py-7 sm:py-9 border-t border-border/60 transition-all duration-300 ease-out">
                  {/* Refined Liquid Glass Hover Selector */}
                  <div
                    className={cn(
                      "absolute inset-0 -mx-3 sm:-mx-5 px-3 sm:px-5 rounded-2xl transition-all duration-300 ease-out pointer-events-none",
                      isCurrentHovered
                        ? "opacity-100 bg-secondary/45 dark:bg-white/[0.04] border border-border/70 dark:border-white/12 shadow-[0_8px_30px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-xs scale-100"
                        : "opacity-0 scale-98 border border-transparent"
                    )}
                  />

                  <div className="relative flex items-start justify-between gap-6 sm:gap-10">
                    <div className="flex-1 min-w-0 pr-4">
                      {/* Title with animated underline and Button-in-Button trailing icon */}
                      <div className="inline-flex items-center gap-3">
                        <h3 className="text-foreground font-serif font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight">
                          <span className="relative">
                            {project.title}
                            {/* Animated underline */}
                            <span
                              className={cn(
                                "absolute left-0 -bottom-1 h-[1.5px] bg-foreground transition-all duration-300 ease-out",
                                isCurrentHovered ? "w-full" : "w-0"
                              )}
                            />
                          </span>
                        </h3>

                        {/* Button-in-Button nested trailing arrow */}
                        <span
                          className={cn(
                            "flex size-7 sm:size-8 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-200 ease-out",
                            isCurrentHovered
                              ? "border-primary/50 bg-primary/10 text-primary scale-105 shadow-xs"
                              : "border-border/60 bg-secondary/30 text-muted-foreground/60"
                          )}
                        >
                          <ArrowUpRight
                            aria-hidden="true"
                            className={cn(
                              "size-3.5 sm:size-4 transition-transform duration-200 ease-out",
                              isCurrentHovered
                                ? "translate-x-0.5 -translate-y-0.5 text-primary"
                                : ""
                            )}
                          />
                        </span>
                      </div>

                      {/* Technical Stack Tags (Liquid Glass Pills) */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center text-[10px] sm:text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-secondary/60 dark:bg-white/[0.06] text-muted-foreground/90 border border-border/60 dark:border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Description with subtle color shift */}
                      <p
                        className={cn(
                          "text-muted-foreground text-sm sm:text-base mt-2.5 max-w-xl lg:max-w-2xl leading-relaxed font-sans transition-colors duration-300 ease-out",
                          isCurrentHovered ? "text-foreground/90" : "text-muted-foreground"
                        )}
                      >
                        {project.description}
                      </p>

                      {/* Mobile Image Preview (visible only on mobile screens where hover preview cannot exist) */}
                      <div className="mt-4 md:hidden overflow-hidden rounded-xl border border-border/70 aspect-[16/9] bg-secondary/30">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Year badge */}
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-mono text-muted-foreground/80 tabular-nums shrink-0 pt-2 transition-colors duration-300 ease-out",
                        isCurrentHovered ? "text-foreground font-semibold" : ""
                      )}
                    >
                      {project.year}
                    </span>
                  </div>
                </div>
              </a>
            </motion.div>
          )
        })}

        {/* Bottom border for last item */}
        <div className="border-t border-border/60" />
      </div>
    </section>
  )
}
