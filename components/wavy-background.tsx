"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface WavyBackgroundProps {
  className?: string
}

export default function WavyBackground({ className = "" }: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    // Set canvas dimensions
    const setDimensions = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    setDimensions()
    window.addEventListener("resize", setDimensions)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX
      mouseRef.current.targetY = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Enhanced wave parameters for more dynamic waves
    const waves = [
      {
        amplitude: 80,
        frequency: 0.003,
        speed: 0.8,
        offset: 0,
        baseY: height * 0.7,
        mouseInfluence: 1.2,
      },
      {
        amplitude: 60,
        frequency: 0.004,
        speed: 1.2,
        offset: Math.PI / 2,
        baseY: height * 0.75,
        mouseInfluence: 0.9,
      },
      {
        amplitude: 100,
        frequency: 0.002,
        speed: 0.6,
        offset: Math.PI,
        baseY: height * 0.8,
        mouseInfluence: 1.5,
      },
      {
        amplitude: 45,
        frequency: 0.005,
        speed: 1.5,
        offset: Math.PI * 1.5,
        baseY: height * 0.85,
        mouseInfluence: 0.7,
      },
    ]

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      time += 0.008

      // Smooth mouse interpolation
      const lerpFactor = 0.03
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * lerpFactor
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * lerpFactor

      // Determine colors based on theme
      const isDark = theme === "dark"

      waves.forEach((wave, index) => {
        ctx.beginPath()

        // Create more vibrant gradients
        const gradient = ctx.createLinearGradient(0, wave.baseY - 200, 0, height)

        if (isDark) {
          const alpha = 0.25 - index * 0.04
          switch (index) {
            case 0:
              gradient.addColorStop(0, `rgba(147, 51, 234, ${alpha})`) // purple
              gradient.addColorStop(1, `rgba(79, 70, 229, ${alpha * 0.3})`) // indigo
              break
            case 1:
              gradient.addColorStop(0, `rgba(99, 102, 241, ${alpha})`) // indigo
              gradient.addColorStop(1, `rgba(59, 130, 246, ${alpha * 0.3})`) // blue
              break
            case 2:
              gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha})`) // blue
              gradient.addColorStop(1, `rgba(16, 185, 129, ${alpha * 0.3})`) // emerald
              break
            case 3:
              gradient.addColorStop(0, `rgba(16, 185, 129, ${alpha})`) // emerald
              gradient.addColorStop(1, `rgba(34, 197, 94, ${alpha * 0.3})`) // green
              break
          }
        } else {
          const alpha = 0.3 - index * 0.05
          switch (index) {
            case 0:
              gradient.addColorStop(0, `rgba(236, 72, 153, ${alpha})`) // pink
              gradient.addColorStop(1, `rgba(168, 85, 247, ${alpha * 0.3})`) // purple
              break
            case 1:
              gradient.addColorStop(0, `rgba(168, 85, 247, ${alpha})`) // purple
              gradient.addColorStop(1, `rgba(59, 130, 246, ${alpha * 0.3})`) // blue
              break
            case 2:
              gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha})`) // blue
              gradient.addColorStop(1, `rgba(16, 185, 129, ${alpha * 0.3})`) // emerald
              break
            case 3:
              gradient.addColorStop(0, `rgba(16, 185, 129, ${alpha})`) // emerald
              gradient.addColorStop(1, `rgba(34, 197, 94, ${alpha * 0.3})`) // green
              break
          }
        }

        // Calculate wave path with enhanced dynamics
        const points = []
        const numPoints = 100

        for (let i = 0; i <= numPoints; i++) {
          const x = (i / numPoints) * width

          // Multiple sine waves for more complex movement
          const primaryWave = Math.sin(x * wave.frequency + time * wave.speed + wave.offset) * wave.amplitude
          const secondaryWave =
            Math.sin(x * wave.frequency * 2.3 + time * wave.speed * 0.7 + wave.offset) * (wave.amplitude * 0.3)
          const tertiaryWave =
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 1.3 + wave.offset) * (wave.amplitude * 0.5)

          let y = wave.baseY + primaryWave + secondaryWave + tertiaryWave

          // Enhanced mouse influence with multiple zones
          const mouseDistance = Math.sqrt(Math.pow(x - mouseRef.current.x, 2) + Math.pow(y - mouseRef.current.y, 2))
          const maxInfluenceDistance = 500

          // Create ripple effect around cursor
          const influence = Math.max(0, 1 - mouseDistance / maxInfluenceDistance)
          const rippleEffect = Math.sin(mouseDistance * 0.02 - time * 3) * influence * 30 * wave.mouseInfluence

          // Vertical mouse influence
          const verticalInfluence = (mouseRef.current.y - wave.baseY) / height
          const mouseWave = influence * influence * 60 * wave.mouseInfluence * Math.sin(time * 2 + index)

          y += rippleEffect + mouseWave * verticalInfluence

          // Add some noise for organic feel
          const noise = Math.sin(x * 0.01 + time * 2) * Math.sin(x * 0.007 + time * 1.5) * 5

          points.push({ x, y: y + noise })
        }

        // Draw ultra-smooth curves
        ctx.moveTo(-50, points[0].y)

        // Use catmull-rom spline for natural curves
        for (let i = 0; i < points.length - 3; i++) {
          const p0 = points[Math.max(0, i - 1)]
          const p1 = points[i]
          const p2 = points[i + 1]
          const p3 = points[Math.min(points.length - 1, i + 2)]

          for (let t = 0; t < 1; t += 0.1) {
            const t2 = t * t
            const t3 = t2 * t

            const x =
              0.5 *
              (2 * p1.x +
                (-p0.x + p2.x) * t +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3)

            const y =
              0.5 *
              (2 * p1.y +
                (-p0.y + p2.y) * t +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)

            if (i === 0 && t === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
        }

        // Complete the shape
        ctx.lineTo(width + 50, points[points.length - 1].y)
        ctx.lineTo(width + 50, height + 50)
        ctx.lineTo(-50, height + 50)
        ctx.closePath()

        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setDimensions)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [theme])

  return <canvas ref={canvasRef} className={`${className} pointer-events-none`} />
}
