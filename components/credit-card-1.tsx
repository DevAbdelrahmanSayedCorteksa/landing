"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

const PERSPECTIVE = 1000
const CARD_ANIMATION_DURATION = 0.6
const INITIAL_DELAY = 0.2

interface CreditCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  variant?: "gradient" | "dark" | "glass"
}

export default function CreditCard({
  cardNumber = "4532 1234 5678 9010",
  cardHolder = "ANKIT VERMA",
  expiryDate = "12/28",
  variant = "gradient",
  className,
}: CreditCardProps) {
  const [isVisible] = React.useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const getMaskedNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    const lastFour = cleaned.slice(-4)
    return `•••• •••• •••• ${lastFour}`
  }

  const variantStyles = {
    gradient: "bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600",
    dark: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900",
    glass: "bg-white/15 dark:bg-white/10 backdrop-blur-xl border border-white/20",
  }

  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="relative w-[26rem] h-64"
        style={{ perspective: PERSPECTIVE }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: CARD_ANIMATION_DURATION }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            rotateX,
            rotateY,
          }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Front of card */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-2xl p-8 shadow-2xl",
              variantStyles[variant],
              "backface-hidden"
            )}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden"
            }}
          >
            {/* Card shimmer effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "linear",
                }}
              />
            </div>

            {/* Card content */}
            <div className="relative h-full flex flex-col justify-between text-white">
              {/* Top section */}
              <div className="flex justify-between items-start">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: INITIAL_DELAY }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-9 rounded bg-gradient-to-br from-amber-600 to-yellow-700 shadow-inner" />
                  <Wifi className="w-6 h-6 rotate-90" />
                </motion.div>

              </div>

              {/* Card number */}
              <motion.div
                className="text-2xl font-mono tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {isVisible ? cardNumber : getMaskedNumber(cardNumber)}
              </motion.div>

              {/* Bottom section */}
              <div className="flex justify-between items-end">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-xs opacity-70 mb-1">CARD HOLDER</div>
                  <div className="font-medium text-sm tracking-wide">{cardHolder}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-xs opacity-70 mb-1">EXPIRES</div>
                  <div className="font-medium text-sm">{isVisible ? expiryDate : "••/••"}</div>
                </motion.div>

                <motion.div
                  className="text-3xl font-bold italic"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.6,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  VISA
                </motion.div>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-20 h-20 bg-violet-400/30 dark:bg-violet-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-400/30 dark:bg-pink-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  )
}
