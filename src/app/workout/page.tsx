'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface RoutineExercise {
  id: string
  name: string
  type: 'cardio' | 'strength'
  category: string
  defaultDuration?: number
  defaultReps?: number
  description?: string
  customDuration?: number
  customReps?: number
}

function WorkoutContent() {
  const searchParams = useSearchParams()
  const routine = JSON.parse(searchParams.get('routine') || '[]') as RoutineExercise[]
  const defaultRest = Number(searchParams.get('rest') || '60')

  const [currentExercise, setCurrentExercise] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (routine.length > 0 && !workoutStarted) {
      const ex = routine[0]
      setTimeLeft(ex.customDuration || ex.customReps || ex.defaultDuration || ex.defaultReps || 30)
    }
  }, [routine, workoutStarted])

  useEffect(() => {
    if (workoutStarted && !isPaused && !isComplete && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [workoutStarted, isPaused, isComplete, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && workoutStarted && !isComplete) {
      if (timerRef.current) clearInterval(timerRef.current)
      
      if (isResting) {
        if (currentExercise < routine.length - 1) {
          setIsResting(false)
          setCurrentExercise(prev => prev + 1)
          const nextEx = routine[currentExercise + 1]
          setTimeLeft(nextEx.customDuration || nextEx.customReps || nextEx.defaultDuration || nextEx.defaultReps || 30)
        } else {
          setIsComplete(true)
        }
      } else {
        setIsResting(true)
        setTimeLeft(defaultRest)
      }
    }
  }, [timeLeft, isResting, currentExercise, routine, defaultRest, workoutStarted, isComplete])

  const startWorkout = () => {
    setWorkoutStarted(true)
    const ex = routine[0]
    setTimeLeft(ex.customDuration || ex.customReps || ex.defaultDuration || ex.defaultReps || 30)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const skipExercise = () => {
    if (currentExercise < routine.length - 1) {
      setIsResting(false)
      setCurrentExercise(prev => prev + 1)
      const nextEx = routine[currentExercise + 1]
      setTimeLeft(nextEx.customDuration || nextEx.customReps || nextEx.defaultDuration || nextEx.defaultReps || 30)
    } else {
      setIsComplete(true)
    }
  }

  if (!workoutStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#00d9ff] mb-4">🏋️ Ready to Workout?</h1>
          <p className="text-gray-400 mb-8">{routine.length} exercises • {defaultRest}s rest</p>
          <button
            onClick={startWorkout}
            className="px-12 py-4 bg-gradient-to-r from-[#00d9ff] to-[#00ff88] text-black font-bold text-xl rounded-full hover:scale-105 transition-all"
          >
            ▶️ Start Workout
          </button>
          <Link href="/routine" className="block mt-4 text-[#00d9ff] hover:underline">← Back to Builder</Link>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-[#00ff88] mb-4">Workout Complete!</h1>
          <p className="text-gray-400 mb-8">Great job! You finished all {routine.length} exercises.</p>
          <Link href="/" className="px-8 py-3 bg-gradient-to-r from-[#00d9ff] to-[#00ff88] text-black font-bold rounded-full">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const ex = routine[currentExercise]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="text-gray-400 mb-2">Exercise {currentExercise + 1} of {routine.length}</div>
          <div className="w-full bg-black/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#00d9ff] to-[#00ff88] h-2 rounded-full transition-all"
              style={{ width: `${((currentExercise + 1) / routine.length) * 100}%` }}
            />
          </div>
        </div>

        <div className={`p-12 rounded-3xl mb-8 ${isResting ? 'bg-[#ffa502]/20 border-[#ffa502]/50' : 'bg-[#00d9ff]/20 border-[#00d9ff]/50'} border-4`}>
          <div className={`text-2xl mb-4 ${isResting ? 'text-[#ffa502]' : 'text-[#00d9ff]'}`}>
            {isResting ? '😮‍💨 Rest Time' : ex.name}
          </div>
          <div className="text-8xl font-bold mb-4">{timeLeft}s</div>
          {!isResting && ex.description && (
            <p className="text-gray-400">{ex.description}</p>
          )}
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={togglePause}
            className="px-8 py-4 bg-white/10 rounded-full font-bold hover:bg-white/20 transition-all"
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            onClick={skipExercise}
            className="px-8 py-4 bg-[#00d9ff]/20 border border-[#00d9ff]/50 rounded-full font-bold hover:bg-[#00d9ff]/30 transition-all"
          >
            ⏭️ Skip
          </button>
        </div>

        {!isResting && currentExercise < routine.length - 1 && (
          <div className="text-gray-400">
            <div className="mb-2">Up Next:</div>
            <div className="text-xl font-bold text-[#00ff88]">{routine[currentExercise + 1].name}</div>
          </div>
        )}

        <Link href="/routine" className="block mt-8 text-[#00d9ff] hover:underline">← Quit Workout</Link>
      </div>
    </div>
  )
}

export default function WorkoutPlayer() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 flex items-center justify-center"><div className="text-[#00d9ff] text-xl">Loading...</div></div>}>
      <WorkoutContent />
    </Suspense>
  )
}
