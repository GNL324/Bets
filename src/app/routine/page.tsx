'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cardioExercises, strengthExercises, type Exercise } from '../../data/exercises'

interface RoutineExercise extends Exercise {
  customDuration?: number
  customReps?: number
}

export default function RoutineBuilder() {
  const [routine, setRoutine] = useState<RoutineExercise[]>([])
  const [defaultRest, setDefaultRest] = useState(60)

  const addToRoutine = (exercise: Exercise) => {
    setRoutine([...routine, { ...exercise }])
  }

  const removeFromRoutine = (index: number) => {
    setRoutine(routine.filter((_, i) => i !== index))
  }

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newRoutine = [...routine]
      ;[newRoutine[index - 1], newRoutine[index]] = [newRoutine[index], newRoutine[index - 1]]
      setRoutine(newRoutine)
    } else if (direction === 'down' && index < routine.length - 1) {
      const newRoutine = [...routine]
      ;[newRoutine[index], newRoutine[index + 1]] = [newRoutine[index + 1], newRoutine[index]]
      setRoutine(newRoutine)
    }
  }

  const updateExercise = (index: number, field: string, value: number) => {
    const newRoutine = [...routine]
    if (field === 'duration') newRoutine[index].customDuration = value
    if (field === 'reps') newRoutine[index].customReps = value
    setRoutine(newRoutine)
  }

  const saveRoutine = () => {
    const routines = JSON.parse(localStorage.getItem('gnl_workout_routines') || '[]')
    routines.push({
      id: Date.now(),
      name: `Routine ${new Date().toLocaleDateString()}`,
      exercises: routine,
      defaultRest,
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('gnl_workout_routines', JSON.stringify(routines))
    alert('✅ Routine saved!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-[#00d9ff] hover:underline">← Back to Home</Link>
        </div>

        <h1 className="text-3xl font-bold text-[#00d9ff] mb-2">🏋️ Workout Routine Builder</h1>
        <p className="text-gray-400 mb-8">Build your custom workout routine</p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur border border-[#00d9ff]/30 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-[#00d9ff] mb-4">💪 Strength Exercises</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {strengthExercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => addToRoutine(ex)}
                    className="p-3 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-lg text-left hover:bg-[#00d9ff]/20 transition-all"
                  >
                    <div className="font-bold text-white">{ex.name}</div>
                    <div className="text-sm text-gray-400">{ex.category} • {ex.defaultReps} reps</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur border border-[#00d9ff]/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[#00d9ff] mb-4">🏃 Cardio Exercises</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {cardioExercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => addToRoutine(ex)}
                    className="p-3 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg text-left hover:bg-[#00ff88]/20 transition-all"
                  >
                    <div className="font-bold text-white">{ex.name}</div>
                    <div className="text-sm text-gray-400">{ex.category} • {ex.defaultDuration}s</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-black/30 backdrop-blur border border-[#00d9ff]/30 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-[#00d9ff] mb-4">📋 Your Routine</h2>
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Default Rest (seconds)</label>
                <input
                  type="number"
                  value={defaultRest}
                  onChange={(e) => setDefaultRest(Number(e.target.value))}
                  className="w-full p-2 bg-black/30 border border-[#00d9ff]/30 rounded-lg text-white"
                />
              </div>

              {routine.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Click exercises to add them</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {routine.map((ex, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold">{ex.name}</div>
                          <div className="text-sm text-gray-400">
                            {ex.type === 'strength' ? `${ex.customReps || ex.defaultReps} reps` : `${ex.customDuration || ex.defaultDuration}s`}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => moveExercise(index, 'up')} className="p-1 hover:bg-white/10 rounded">↑</button>
                          <button onClick={() => moveExercise(index, 'down')} className="p-1 hover:bg-white/10 rounded">↓</button>
                          <button onClick={() => removeFromRoutine(index)} className="p-1 hover:bg-red-500/20 rounded text-red-400">✕</button>
                        </div>
                      </div>
                      {ex.type === 'strength' ? (
                        <input
                          type="number"
                          placeholder="Reps"
                          value={ex.customReps || ''}
                          onChange={(e) => updateExercise(index, 'reps', Number(e.target.value))}
                          className="w-full p-1 text-sm bg-black/30 border border-[#00d9ff]/30 rounded text-white"
                        />
                      ) : (
                        <input
                          type="number"
                          placeholder="Seconds"
                          value={ex.customDuration || ''}
                          onChange={(e) => updateExercise(index, 'duration', Number(e.target.value))}
                          className="w-full p-1 text-sm bg-black/30 border border-[#00d9ff]/30 rounded text-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={saveRoutine}
                disabled={routine.length === 0}
                className="w-full py-3 bg-gradient-to-r from-[#00d9ff] to-[#00ff88] text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Save Routine
              </button>

              <Link
                href={`/workout?routine=${encodeURIComponent(JSON.stringify(routine))}&rest=${defaultRest}`}
                className={`block w-full py-3 mt-3 text-center bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-lg ${routine.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ▶️ Start Workout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
