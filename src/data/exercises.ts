export interface Exercise {
  id: string
  name: string
  type: 'cardio' | 'strength'
  category: string
  defaultDuration?: number
  defaultReps?: number
  description?: string
}

export const cardioExercises: Exercise[] = [
  { id: 'c1', name: 'Jump Rope', type: 'cardio', category: 'Cardio', defaultDuration: 60, description: 'Fast-paced jumping' },
  { id: 'c2', name: 'High Knees', type: 'cardio', category: 'Cardio', defaultDuration: 45, description: 'Run in place, knees high' },
  { id: 'c3', name: 'Burpees', type: 'cardio', category: 'Cardio', defaultDuration: 45, description: 'Full body explosive' },
  { id: 'c4', name: 'Mountain Climbers', type: 'cardio', category: 'Cardio', defaultDuration: 45, description: 'Plank position, drive knees' },
  { id: 'c5', name: 'Jumping Jacks', type: 'cardio', category: 'Cardio', defaultDuration: 60, description: 'Classic jumping jacks' },
  { id: 'c6', name: 'Running in Place', type: 'cardio', category: 'Cardio', defaultDuration: 120, description: 'Steady pace jogging' },
  { id: 'c7', name: 'Box Steps', type: 'cardio', category: 'Cardio', defaultDuration: 60, description: 'Step up/down on box' },
  { id: 'c8', name: 'Sprint Intervals', type: 'cardio', category: 'Cardio', defaultDuration: 30, description: 'All-out sprint' },
]

export const strengthExercises: Exercise[] = [
  { id: 's1', name: 'Push-ups', type: 'strength', category: 'Upper Body', defaultReps: 15, description: 'Standard or modified' },
  { id: 's2', name: 'Squats', type: 'strength', category: 'Lower Body', defaultReps: 20, description: 'Bodyweight or weighted' },
  { id: 's3', name: 'Lunges', type: 'strength', category: 'Lower Body', defaultReps: 12, description: 'Each leg' },
  { id: 's4', name: 'Plank', type: 'strength', category: 'Core', defaultDuration: 45, description: 'Hold steady position' },
  { id: 's5', name: 'Dumbbell Rows', type: 'strength', category: 'Upper Body', defaultReps: 12, description: 'Each arm' },
  { id: 's6', name: 'Deadlifts', type: 'strength', category: 'Lower Body', defaultReps: 10, description: 'Hip hinge movement' },
  { id: 's7', name: 'Shoulder Press', type: 'strength', category: 'Upper Body', defaultReps: 12, description: 'Overhead press' },
  { id: 's8', name: 'Bicep Curls', type: 'strength', category: 'Upper Body', defaultReps: 15, description: 'Dumbbell or barbell' },
  { id: 's9', name: 'Tricep Dips', type: 'strength', category: 'Upper Body', defaultReps: 12, description: 'Bench or parallel bars' },
  { id: 's10', name: 'Russian Twists', type: 'strength', category: 'Core', defaultReps: 20, description: 'Each side' },
  { id: 's11', name: 'Leg Raises', type: 'strength', category: 'Core', defaultReps: 15, description: 'Lying or hanging' },
  { id: 's12', name: 'Kettlebell Swings', type: 'strength', category: 'Full Body', defaultReps: 15, description: 'Hip-driven swing' },
  { id: 's13', name: 'Pull-ups', type: 'strength', category: 'Upper Body', defaultReps: 8, description: 'Or assisted' },
  { id: 's14', name: 'Bench Press', type: 'strength', category: 'Upper Body', defaultReps: 10, description: 'Barbell or dumbbell' },
  { id: 's15', name: 'Calf Raises', type: 'strength', category: 'Lower Body', defaultReps: 20, description: 'Standing or seated' },
]

export const allExercises = [...cardioExercises, ...strengthExercises]
