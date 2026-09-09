"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

export interface Project {
  title: string
  description: string
  year: string
  link: string
  image: string
}

export const defaultProjects: Project[] = [
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
    image: "/sewainaja.png",
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
    link: "/projects/impp-website",
    image: "/impp-screenshot.png",
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
  const [isNearRight, setIsNearRight] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Hardware-accelerated fluid spring physics (Emil Kowalski standard)
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const springConfig = { damping: 28, stiffness: 320, mass: 0.35 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
    if (typeof window !== "undefined") {
      setIsNearRight(e.clientX > window.innerWidth - 440)
    }
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

      {/* Floating Hover Image Preview Cursor (Desktop only) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block will-change-transform"
        style={{
          x: smoothX,
          y: smoothY,
        }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: isVisible ? 1 : 0,
            x: isNearRight ? -430 : 28,
            y: -115,
          }}
          transition={{
            opacity: { duration: 0.16, ease: [0.23, 1, 0.32, 1] },
            x: { duration: 0.22, ease: [0.23, 1, 0.32, 1] },
            y: { duration: 0.22, ease: [0.23, 1, 0.32, 1] },
          }}
          className="relative w-[360px] lg:w-[410px] aspect-[16/9] bg-secondary/95 backdrop-blur-md rounded-2xl overflow-hidden border border-border/80 dark:border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.5)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
        >
          {projects.map((project, index) => (
            <img
              key={project.title}
              src={project.image || "/placeholder.svg"}
              alt=""
              loading="eager"
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ease-out",
                hoveredIndex === index ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
        </motion.div>
      </motion.div>

      <div className="w-full space-y-0">
        {projects.map((project, index) => (
          <a
            key={project.title}
            href={project.link}
            onClick={(e) => handleProjectClick(e, project.link)}
            className="group block rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
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
