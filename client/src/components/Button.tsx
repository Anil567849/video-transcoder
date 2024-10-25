
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function SubmitButton({handleSubmit}: {handleSubmit: () => void}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
      <motion.button
        className="relative px-8 py-4 text-xl font-bold text-white rounded-full overflow-hidden"
        style={{
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          boxShadow: isHovered
            ? '0 0 25px 5px rgba(78, 205, 196, 0.5)'
            : '0 5px 15px rgba(0, 0, 0, 0.2)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleSubmit}
      >
        <span className="relative z-10 flex items-center justify-center">
          <Sparkles className="w-6 h-6 mr-2" />
          Submit
        </span>
        <motion.div
          className="absolute inset-0 bg-white opacity-20"
          initial={{ scale: 0, x: '100%' }}
          animate={isHovered ? { scale: 1.5, x: 0 } : { scale: 0, x: '100%' }}
          transition={{ duration: 0.3 }}
        />
        {isHovered && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{
                  opacity: 0,
                  x: '50%',
                  y: '50%',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.button>
  )
}