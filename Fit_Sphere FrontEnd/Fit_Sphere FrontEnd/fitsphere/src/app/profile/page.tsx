"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import './profile.css'

interface UserProfile {
  _id: string
  name: string
  email: string
  weight: Array<{ weight: number; unit: string; date: string }>
  height: Array<{ height: number; unit: string; date: string }>
  gender: string
  dob: string
  goal: string
  activityLevel: string
  calorieIntake: Array<any>
  steps: Array<any>
  water: Array<any>
  sleep: Array<any>
}

const ProfilePage: React.FC = () => {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/profile`, {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please login first')
            router.push('/')
            return
          }
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch profile')
        }

        const data = await response.json()
        if (data.ok && data.data) {
          setUser(data.data)
        } else {
          setError(data.message || 'Failed to load profile')
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile data'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [router])

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="profile-container">
        <div className="error-message">{error || 'Failed to load profile'}</div>
      </div>
    )
  }

  const currentWeight = user.weight.length > 0 ? user.weight[user.weight.length - 1] : null
  const currentHeight = user.height.length > 0 ? user.height[user.height.length - 1] : null
  const currentWater = user.water || []
  const currentSteps = user.steps || []
  const currentSleep = user.sleep || []

  // Calculate BMI if we have weight and height
  let bmi: string | null = null
  let bmiValue: number | null = null
  if (currentWeight && currentHeight) {
    const weightInKg = currentWeight.unit === 'kg' ? currentWeight.weight : currentWeight.weight * 0.453592
    const heightInM = (currentHeight.unit === 'cm' ? currentHeight.height : currentHeight.height * 100) / 100
    bmiValue = weightInKg / (heightInM * heightInM)
    bmi = bmiValue.toFixed(2)
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>

      <div className="profile-card">
        <div className="profile-section personal-info">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{user.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Gender:</label>
              <span>{user.gender}</span>
            </div>
            <div className="info-item">
              <label>Date of Birth:</label>
              <span>{new Date(user.dob).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Fitness Goal:</label>
              <span>{user.goal}</span>
            </div>
            <div className="info-item">
              <label>Activity Level:</label>
              <span>{user.activityLevel}</span>
            </div>
          </div>
        </div>

        <div className="profile-section health-metrics">
          <h2>Health Metrics</h2>
          <div className="metrics-grid">
            {currentWeight && (
              <div className="metric-card">
                <h3>Weight</h3>
                <div className="metric-value">{currentWeight.weight} {currentWeight.unit}</div>
                <div className="metric-date">{new Date(currentWeight.date).toLocaleDateString()}</div>
              </div>
            )}
            {currentHeight && (
              <div className="metric-card">
                <h3>Height</h3>
                <div className="metric-value">{currentHeight.height} {currentHeight.unit}</div>
                <div className="metric-date">{new Date(currentHeight.date).toLocaleDateString()}</div>
              </div>
            )}
            {bmi && (
              <div className="metric-card">
                <h3>BMI</h3>
                <div className="metric-value">{bmi}</div>
                <div className="metric-date">
                  {bmiValue! < 18.5 ? 'Underweight' : bmiValue! < 25 ? 'Normal' : bmiValue! < 30 ? 'Overweight' : 'Obese'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
