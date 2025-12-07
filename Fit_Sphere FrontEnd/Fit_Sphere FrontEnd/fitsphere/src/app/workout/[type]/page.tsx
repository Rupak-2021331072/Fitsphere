"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import './workoutpage.css'

interface WorkoutExercise {
  exercise: string
  videoUrl: string
  sets: number
  reps: number
  rest: number
  description: string
}

interface WorkoutData {
  type: string
  imageUrl: string
  durationInMin: number
  exercises: WorkoutExercise[]
}

// Default fallback workouts in case backend is unavailable
const DEFAULT_WORKOUT_PLANS: Record<string, WorkoutData> = {
  chest: {
    type: 'Chest',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    durationInMin: 45,
    exercises: [
      {
        exercise: 'Flat Bench Press',
        videoUrl: 'https://gymvisual.com/img/p/1/7/5/5/2/17552.gif' ,
        sets: 4,
        reps: 8,
        rest: 90,
        description: 'The primary chest builder. Place feet flat on ground, lower bar to mid-chest, and press explosively. Control the weight for maximum chest activation.'
      },
      {
        exercise: 'Incline Dumbbell Press',
        videoUrl: 'https://gymvisual.com/img/p/1/0/3/9/8/10398.gif',
        sets: 3,
        reps: 10,
        rest: 75,
        description: 'Targets upper chest and front shoulders. Maintain a 45-degree incline, press dumbbells up and slightly inward for optimal chest engagement.'
      }
    ]
  },
  back: {
    type: 'Back',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    durationInMin: 50,
    exercises: [
      {
        exercise: 'Headbanger',
        videoUrl: 'https://gymvisual.com/img/p/4/0/1/7/9/40179.gif',
        sets: 3,
        reps: 12,
        rest: 60,
        description: 'Dynamic neck exercise. Move head in controlled manner, engaging neck muscles. Keep body stable and posture straight throughout.'
      },
      {
        exercise: 'Ring Resistance Band Assisted Single Arm Pull-up',
        videoUrl: 'https://gymvisual.com/img/p/4/0/0/0/1/40001.gif',
        sets: 3,
        reps: 8,
        rest: 90,
        description: 'Advanced pulling exercise. Use resistance band for assistance, pull body up, and control the descent. Great for building lat strength.'
      }
    ]
  },
  legs: {
    type: 'Legs',
    imageUrl: 'https://images.unsplash.com/photo-1434755566174-c853a0503371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    durationInMin: 55,
    exercises: [
      {
        exercise: 'Lever Seated Leg Curl ',
        videoUrl: 'https://gymvisual.com/img/p/4/0/3/6/3/40363.gif',
        sets: 3,
        reps: 12,
        rest: 75,
        description: 'Isolate hamstrings with machine. Sit with legs extended, curl weight towards you. Maintain controlled tempo and full range of motion.'
      },
      {
        exercise: '4 Way Single Leg Hop ',
        videoUrl: 'https://gymvisual.com/img/p/4/0/3/6/7/40367.gif',
        sets: 3,
        reps: 10,
        rest: 60,
        description: 'Explosive leg power exercise. Hop in four directions on one leg, maintaining balance and control. Strengthens quads and stabilizer muscles.'
      }
    ]
  },
  triceps: {
    type: 'Triceps',
    imageUrl: 'https://gymvisual.com/img/p/2/0/8/5/8/20858.gif',
    durationInMin: 40,
    exercises: [
      {
        exercise: 'Triceps Press',
        videoUrl: '',
        sets: 4,
        reps: 8,
        rest: 90,
        description: 'Build shoulder strength and mass. Press bar overhead with strict form, avoid excessive back arch.'
      },
      {
        exercise: 'Lateral Raises',
        videoUrl: 'https://www.youtube.com/embed/3VcKaXpzMnc',
        sets: 3,
        reps: 12,
        rest: 60,
        description: 'Shoulder width builder. Lift dumbbells to shoulder height with slight elbow bend and controlled movement.'
      }
    ]
  },
  shoulder: {
    type: 'Shoulders',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    durationInMin: 40,
    exercises: [
      {
        exercise: 'Side Mountain Climber',
        videoUrl: 'https://gymvisual.com/img/p/4/0/1/4/5/40145.gif',
        sets: 3,
        reps: 12,
        rest: 60,
        description: 'Intense core and cardio exercise. From plank position, drive knees side to side alternately. Engage core and maintain stable plank.'
      },
      {
        exercise: 'Place Jog',
        videoUrl: 'https://gymvisual.com/img/p/4/0/1/3/5/40135.gif',
        sets: 2,
        reps: 15,
        rest: 45,
        description: 'Quick footwork exercise. Jog in place while staying in position. Improves coordination and leg endurance.'
      }
    ]
  },
  arms: {
    type: 'Arms',
    imageUrl: 'https://images.unsplash.com/photo-1521805103424-da8ec91ff537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    durationInMin: 35,
    exercises: [
      {
        exercise: 'Barbell Curls',
        videoUrl: 'https://www.youtube.com/embed/ykJmrsCL4LQ',
        sets: 4,
        reps: 8,
        rest: 90,
        description: 'Classic bicep builder. Keep elbows stable, curl bar to shoulder height, and control the negative.'
      },
      {
        exercise: 'Tricep Dips',
        videoUrl: 'https://www.youtube.com/embed/6Xw8IhjQTEE',
        sets: 3,
        reps: 10,
        rest: 75,
        description: 'Compound tricep exercise. Lower body below parallel, keep elbows tight, and press back up explosively.'
      }
    ]
  },
  cardio: {
    type: 'Cardio',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-5defe6aa44bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    durationInMin: 45,
    exercises: [
      {
        exercise: 'High Knee to Butt Kick',
        videoUrl: 'https://gymvisual.com/img/p/4/0/3/6/7/40367.gif',
        sets: 3,
        reps: 20,
        rest: 45,
        description: 'Dynamic cardio exercise. Alternate high knees and butt kicks at fast pace. Increases heart rate and leg power.'
      },
      {
        exercise: 'Side Mountain Climber ',
        videoUrl: 'https://gymvisual.com/img/p/4/0/1/4/5/40145.gif',
        sets: 3,
        reps: 20,
        rest: 45,
        description: 'High-intensity core and cardio blast. Alternate side-to-side knee drive from plank. Builds explosive power and endurance.'
      }
    ]
  },
  abs: {
    type: 'Abs',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    durationInMin: 25,
    exercises: [
      {
        exercise: 'Crunches',
        videoUrl: 'https://gymvisual.com/img/p/5/9/3/5/5935.gif',
        sets: 3,
        reps: 20,
        rest: 45,
        description: 'Lie on back with knees bent, place hands behind head, and lift upper body towards knees. Focus on controlled movement.'
      },
      {
        exercise: 'Explosive Dynamic Plank',
        videoUrl:'https://gymvisual.com/img/p/4/0/1/5/7/40157.gif',
        sets: 3,
        reps: 12,
        rest: 60,
        description: 'Hang from pull-up bar, raise legs to 90 degrees, and lower with control. Keep core tight throughout.'
      }
    ]
  },
  biceps: {
    type: 'Biceps',
    imageUrl: 'https://images.unsplash.com/photo-1521805103424-da8ec91ff537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    durationInMin: 30,
    exercises: [
      {
        exercise: 'Lever Seated Bent Over Rear Delt Fly',
        videoUrl: 'https://gymvisual.com/img/p/4/0/1/4/1/40141.gif',
        sets: 3,
        reps: 12,
        rest: 60,
        description: 'Posterior shoulder isolator. Sit bent over, fly handles out to sides. Excellent for rear delt and shoulder health.'
      },
      {
        exercise: 'Stick Lying Front Raise',
        videoUrl: 'https://gymvisual.com/img/p/3/9/8/3/0/39830.gif',
        sets: 3,
        reps: 12,
        rest: 60,
        description: 'Front shoulder builder. Lie down and raise stick forward. Targets anterior deltoids with controlled motion.'
      }
    ]
  },
  forearms: {
    type: 'Forearms',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    durationInMin: 25,
    exercises: [
      {
        exercise: 'Dumbbell Wrist Rotation',
        videoUrl: 'https://gymvisual.com/img/p/4/0/5/3/1/40531.gif',
        sets: 3,
        reps: 15,
        rest: 60,
        description: 'Forearm rotator strengthener. Hold dumbbell and rotate wrist in controlled motion. Improves grip strength and forearm endurance.'
      },
      {
        exercise: 'Uneven Pull-up',
        videoUrl: 'https://gymvisual.com/img/p/3/9/9/9/3/39993.gif',
        sets: 3,
        reps: 8,
        rest: 90,
        description: 'Advanced pulling movement. Perform pull-ups with focus on inner arm. Builds deep arm strength.'
      }
    ]
  }
}

export const Page = () => {
  const params = useParams()
  const workoutType = (params.type as string)?.toLowerCase() || 'chest'
  const [workout, setWorkout] = React.useState<WorkoutData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch from backend first
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts`)
        if (response.ok) {
          const data = await response.json()
          if (data.ok && data.data) {
            // Find workout by name (case-insensitive)
            const foundWorkout = data.data.find((w: any) => 
              w.name.toLowerCase() === workoutType
            )
            
            if (foundWorkout) {
              // Convert backend data to WorkoutData format
              const convertedWorkout: WorkoutData = {
                type: foundWorkout.name,
                imageUrl: foundWorkout.imageURL || DEFAULT_WORKOUT_PLANS[workoutType]?.imageUrl || '',
                durationInMin: foundWorkout.durationInMinutes || 0,
                exercises: foundWorkout.exercises.map((ex: any) => ({
                  exercise: ex.name,
                  videoUrl: ex.imageURL || '',
                  sets: ex.sets || 0,
                  reps: ex.reps || 0,
                  rest: 60, // Default rest time if not provided
                  description: ex.description || ''
                }))
              }
              setWorkout(convertedWorkout)
              return
            }
          }
        }
        
        // Fall back to default data if backend fetch fails or workout not found
        const defaultWorkout = DEFAULT_WORKOUT_PLANS[workoutType] || DEFAULT_WORKOUT_PLANS['chest']
        setWorkout(defaultWorkout)
      } catch (err) {
        console.error('Error fetching workout:', err)
        // Use default data on error
        const defaultWorkout = DEFAULT_WORKOUT_PLANS[workoutType] || DEFAULT_WORKOUT_PLANS['chest']
        setWorkout(defaultWorkout)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkout()
  }, [workoutType])

  if (loading) {
    return (
      <div className='workout'>
        <h1 className='mainhead1'>Loading...</h1>
        <p style={{textAlign: 'center', color: '#aaa'}}>Please wait while we load your workout...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='workout'>
        <h1 className='mainhead1'>Error</h1>
        <p style={{textAlign: 'center', color: '#ff6b6b'}}>{error}</p>
      </div>
    )
  }
  return (
    <div className='workout'>
      <h1 className='mainhead1'>{workout?.type} Day Workout</h1>
      <div style={{marginBottom: '20px', textAlign: 'center', color: '#aaa'}}>
        <p>Duration: {workout?.durationInMin} minutes | Total Exercises: {workout?.exercises.length}</p>
      </div>
      <div className='workout__exercises'>
        {workout?.exercises.map((item: WorkoutExercise, index: number) => (
          <div
            key={index}
            className={
              index % 2 === 0 ? 'workout__exercise' : 'workout__exercise workout__exercise--reverse'
            }
          >
            <h3>{index + 1}</h3>
            <div className='workout__exercise__image'>
              {item.videoUrl.includes('gymvisual.com') ? (
                <iframe 
                  src={item.videoUrl} 
                  width="100%" 
                  height="400" 
                  style={{ border: 'none', borderRadius: '8px' }}
                  title={item.exercise}
                />
              ) : (
                <img src={item.videoUrl} alt={item.exercise} />
              )}
            </div>
            <div className='workout__exercise__content'>
              <h2>{item.exercise}</h2>
              <span>{item.sets} sets × {item.reps} reps | Rest: {item.rest}s</span>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Page