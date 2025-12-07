'use client'

import React from 'react'
import './about.css'

export default function AboutPage() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>FitSphere</h1>
          <p className="subtitle">Track your fitness, stay consistent, level up</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section mission-section">
        <div className="section-content">
          <div className="section-text">
            <h2>What We Do</h2>
            <p>
              FitSphere helps you track your daily health metrics and stay on top of your workouts. 
              We built this because we got tired of juggling multiple apps to track calories, water, steps, 
              and workouts. Now everything you need is in one place.
            </p>
            <p>
              Whether you're just starting your fitness journey or you're already hitting the gym regularly, 
              FitSphere keeps you accountable and shows you the progress you're actually making.
            </p>
          </div>
          <div className="section-image">
            <div className="image-placeholder mission-icon">📱</div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="about-section vision-section">
        <div className="section-content">
          <div className="section-image">
            <div className="image-placeholder vision-icon">💯</div>
          </div>
          <div className="section-text">
            <h2>Why We Built This</h2>
            <p>
              We realized that most fitness apps are either too complicated or missing key features. 
              You shouldn't need a degree to log your daily activities or plan your workout.
            </p>
            <p>
              FitSphere is straightforward. No ads, no unnecessary features. Just simple, effective tracking 
              that actually helps you see your progress and stay motivated to reach your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-section features-section">
        <h2 className="section-title">What You Get</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>All Your Metrics</h3>
            <p>Track calories, water intake, steps, sleep, weight, and workouts without switching between apps.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏋️</div>
            <h3>Workout Programs</h3>
            <p>9 different workout categories with real exercises and video guides. Pick what works for you.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Set Real Goals</h3>
            <p>Set targets for each metric and update them whenever you want. Actually see if you're hitting them.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>See Your Progress</h3>
            <p>Graphs and charts that show your progress over time. Nothing motivates like seeing it work.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Your Data Stays Yours</h3>
            <p>Everything is saved locally on your device. We never see your health data.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>No Nonsense</h3>
            <p>Fast, clean interface. No ads, no bloat. Just logging in and getting to work.</p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="about-section key-features">
        <h2 className="section-title">The Details</h2>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-number">1</span>
            <div className="feature-detail">
              <h3>Track Everything That Matters</h3>
              <p>Calories, water, steps, sleep, weight, workouts. Log them once and track them over time with real charts.</p>
            </div>
          </div>

          <div className="feature-item">
            <span className="feature-number">2</span>
            <div className="feature-detail">
              <h3>9 Workout Programs</h3>
              <p>Chest, back, legs, shoulders, arms, cardio, abs, biceps, forearms. Each with real exercises and demo videos.</p>
            </div>
          </div>

          <div className="feature-item">
            <span className="feature-number">3</span>
            <div className="feature-detail">
              <h3>Data That Sticks Around</h3>
              <p>Your data is saved automatically. Close the app, come back next week, everything is still there.</p>
            </div>
          </div>

          <div className="feature-item">
            <span className="feature-number">4</span>
            <div className="feature-detail">
              <h3>See Your Results</h3>
              <p>Visual charts show your progress. Nothing is more motivating than actually seeing the improvement.</p>
            </div>
          </div>

          <div className="feature-item">
            <span className="feature-number">5</span>
            <div className="feature-detail">
              <h3>Goals You Actually Set</h3>
              <p>Set targets for each metric. Update them whenever you want. See if you're hitting your targets.</p>
            </div>
          </div>

          <div className="feature-item">
            <span className="feature-number">6</span>
            <div className="feature-detail">
              <h3>Video Guides for Every Exercise</h3>
              <p>Not sure how to do an exercise? Every workout has a video so you know exactly what to do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FitSphere */}
      <section className="about-section why-section">
        <h2 className="section-title">Why FitSphere?</h2>
        <div className="why-grid">
          <div className="why-card">
            <h3>Simple</h3>
            <p>One app for everything. No jumping between apps to log your workout, then another to log calories.</p>
          </div>

          <div className="why-card">
            <h3>Actually Works</h3>
            <p>Real workouts. Real tracking. Real results. Built by people who actually use it.</p>
          </div>

          <div className="why-card">
            <h3>No Hidden Stuff</h3>
            <p>No premium tiers hidden behind paywalls. No data collection. Just you and your fitness.</p>
          </div>

          <div className="why-card">
            <h3>Stays With You</h3>
            <p>Your data is on your device. Your phone, your data. That simple.</p>
          </div>

          <div className="why-card">
            <h3>Actually Helpful</h3>
            <p>Charts and graphs that make sense. Goal setting that actually works. Progress that's easy to see.</p>
          </div>

          <div className="why-card">
            <h3>Just Works</h3>
            <p>No bugs, no crashes, no weird interface. Just a tool that does what it's supposed to do.</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="about-section tech-section">
        <h2 className="section-title">Built With</h2>
        <div className="tech-stack">
          <div className="tech-item">
            <h4>Frontend</h4>
            <p>Next.js, React, TypeScript</p>
          </div>
          <div className="tech-item">
            <h4>Backend</h4>
            <p>Node.js, Express, MongoDB</p>
          </div>
          <div className="tech-item">
            <h4>Data</h4>
            <p>Local Storage, Charts.js</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-section cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Jump in and start tracking. It takes 2 minutes to set up.</p>
          <a href="/" className="cta-button">Go to App</a>
        </div>
      </section>

      {/* Footer Info */}
      <section className="about-section footer-info">
        <div className="footer-content">
          <h3>Questions?</h3>
          <p>FitSphere is built to be straightforward. Everything should make sense. If something doesn't, just use the app and you'll figure it out pretty quickly.</p>
        </div>
      </section>
    </div>
  )
}
