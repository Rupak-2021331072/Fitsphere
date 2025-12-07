"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import "./ReportPage.css";

// --- 1. CONFIGURATION: Defines the 6 separate "Modes" ---
type CategoryKey = 'calories' | 'water' | 'steps' | 'sleep' | 'workout' | 'weight';

const CATEGORIES: Record<CategoryKey, { 
  label: string; 
  unit: string; 
  color: string; 
  goal: number; 
  icon: string;
  isSum: boolean; // True = Sum (Calories), False = Last Value (Weight)
}> = {
  calories: { label: 'Calories', unit: 'kcal', color: '#FFD700', goal: 2500, icon: '🔥', isSum: true },
  water:    { label: 'Water',    unit: 'ml',   color: '#00E0FF', goal: 3000, icon: '💧', isSum: true },
  steps:    { label: 'Steps',    unit: 'steps',color: '#2ed573', goal: 10000,icon: '👟', isSum: true },
  sleep:    { label: 'Sleep',    unit: 'hrs',  color: '#a55eea', goal: 8,    icon: '😴', isSum: true },
  workout:  { label: 'Workout',  unit: 'min',  color: '#ff7f50', goal: 60,   icon: '💪', isSum: true },
  weight:   { label: 'Weight',   unit: 'kg',   color: '#ff4757', goal: 75,   icon: '⚖️', isSum: false },
};

// --- 2. TYPES ---
type Entry = {
  id: string;
  item: string; 
  date: string;
  value: number;
};

// --- 3. CHART COMPONENT (Generic & Reusable) ---
const SmartGraph = ({ data, color, unit }: { data: { label: string, value: number }[], color: string, unit: string }) => {
  const height = 300;
  const width = 700;
  const padding = 60;
  const maxVal = Math.max(...data.map(d => d.value), 10) * 1.2; 

  const getPath = () => {
    if (data.length === 0) return { path: "", lastX: 0, points: [] };
    const xStep = (width - padding * 2) / (data.length - 1 || 1);
    const points = data.map((d, i) => ({
      x: padding + i * xStep,
      y: height - padding - (d.value / maxVal) * (height - padding * 2)
    }));

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i+1];
        const midX = (p0.x + p1.x) / 2;
        d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return { path: d, lastX: points[points.length-1].x, points };
  };

  const { path: linePath, lastX, points } = getPath();
  const fillPath = linePath ? `${linePath} L ${lastX} ${height-padding} L ${padding} ${height-padding} Z` : "";

  return (
    <div className="chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} style={{width:'100%', overflow:'visible'}}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Y-Axis Label */}
        <text x="15" y="30" fontSize="12" fill="#888" textAnchor="middle" fontWeight="bold">
          {unit}
        </text>

        {/* Y-Axis */}
        <line x1={padding} y1={padding} x2={padding} y2={height-padding} stroke="#555" strokeWidth="2" />
        
        {/* X-Axis */}
        <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#555" strokeWidth="2" />

        {/* X-Axis Label */}
        <text x={width/2} y={height-10} fontSize="12" fill="#888" textAnchor="middle" fontWeight="bold">
          Days
        </text>

        {/* Y-Axis Ticks and Labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const yVal = Math.round(maxVal * (1 - t));
          const yPos = height - padding - (t * (height - padding * 2));
          return (
            <g key={`y-${i}`}>
              <line x1={padding-5} y1={yPos} x2={padding} y2={yPos} stroke="#555" strokeWidth="1" />
              <text x={padding-10} y={yPos+4} fontSize="11" fill="#aaa" textAnchor="end">
                {yVal}
              </text>
            </g>
          );
        })}

        {/* Grid Lines */}
        {[0, 0.5, 1].map((t, i) => (
           <line key={i} x1={padding} y1={height-padding-(t*(height-padding*2))} x2={width-padding} y2={height-padding-(t*(height-padding*2))} stroke="#333" strokeDasharray="4" />
        ))}
        
        {/* The Graph */}
        <path d={fillPath} fill={`url(#grad-${color})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        
        {/* Dots with Value Labels */}
        {points?.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#1E1E1E" stroke={color} strokeWidth="2" />
            <text x={p.x} y={p.y-12} fontSize="11" fill={color} textAnchor="middle" fontWeight="bold">
              {data[i].value}
            </text>
          </g>
        ))}

        {/* X-Axis Labels (Days) */}
        {data.map((d, i) => {
          const xPos = padding + (i / (data.length - 1 || 1)) * (width - padding * 2);
          return (
            <text 
              key={`x-${i}`} 
              x={xPos} 
              y={height - padding + 25} 
              fontSize="11" 
              fill="#aaa" 
              textAnchor="middle"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// --- FOOD DATABASE (100+ foods with calorie info per 100g) ---
const FOOD_DATABASE: Record<string, number> = {
  // Proteins
  chicken: 165, beef: 250, pork: 242, fish: 100, salmon: 208, tuna: 144,
  turkey: 135, lamb: 294, duck: 337, shrimp: 99, crab: 102, lobster: 89,
  eggs: 155, tofu: 76, paneer: 265, tempeh: 195, seitan: 370,
  
  // Grains & Cereals
  rice: 130, wheat: 340, oats: 389, quinoa: 368, barley: 354, corn: 365,
  pasta: 370, bread: 265, rye: 338, millet: 378, buckwheat: 343,
  
  // Vegetables
  broccoli: 34, spinach: 23, carrot: 41, tomato: 18, potato: 77,
  onion: 40, garlic: 149, lettuce: 15, cucumber: 15, bell_pepper: 31,
  cabbage: 25, cauliflower: 25, peas: 81, beans: 127, chickpeas: 164,
  lentils: 116, asparagus: 20, beets: 43, mushroom: 22, zucchini: 17,
  
  // Fruits
  banana: 89, apple: 52, orange: 47, grape: 67, strawberry: 32,
  blueberry: 57, watermelon: 30, mango: 60, pineapple: 50, kiwi: 61,
  papaya: 43, peach: 39, pear: 57, avocado: 160, coconut: 354,
  lemon: 29, lime: 30,
  
  // Dairy
  milk: 61, yogurt: 59, cheese: 402, butter: 717, cream: 340,
  
  // Nuts & Seeds
  almond: 579, walnut: 654, peanut: 567, cashew: 553, pistachio: 556,
  sunflower_seed: 584, flaxseed: 534, chia_seed: 486,
  
  // Oils & Fats
  olive_oil: 884, coconut_oil: 892,
  
  // Processed Foods
  pizza: 285, burger: 215, fries: 365, chips: 541, chocolate: 535,
  soda: 42, beer: 43, wine: 85, juice: 45,

  // --- SUBCONTINENTAL FOODS (Indian, Pakistani, Bangladeshi) ---
  // Indian Breads
  roti: 165, naan: 262, paratha: 234, chapati: 165, puri: 300,
  dosa: 168, idli: 150, uttapam: 172,
  
  // Indian Rice Dishes
  biryani: 206, pulao: 178, khichdi: 145,
  
  // Indian Curries & Gravies
  butter_chicken: 197, tikka_masala: 168, curry_paste: 45,
  
  // Indian Vegetables & Sides
  samosa: 262, pakora: 285, aloo_gobi: 98, dal_makhani: 116,
  rajma: 91, chana_masala: 121, palak_paneer: 108,
  
  // Indian Breads & Snacks
  bhatura: 276, poha: 76, upma: 140, chole_bhature: 285,
  
  // Indian Condiments & Sauces
  ghee: 884, coconut_milk: 230, tamarind: 239,
  
  // Indian Spices & Flavoring
  turmeric: 312, cumin: 375, coriander: 298, ginger: 80,
  chili_powder: 318, cardamom: 311,
  
  // Indian Desserts
  gulab_jamun: 183, kheer: 139, barfi: 369, jalebi: 296,
  rasgulla: 106, laddu: 387, halwa: 350,
  
  // Pakistani Foods
  seekh_kebab: 177, nihari: 145, karahi: 198, shami_kebab: 234,
  
  // Bangladeshi Foods
  shorshe_ilish: 235, hilsa_fish: 215, pantabhat: 142,
  biriyani: 206, khichuri: 145, tehari: 182,
  luchi: 280, puri_bd: 300, paratha_bd: 234,
  samosa_bd: 262, spring_roll: 245, fuchka: 180,
  bhelpuri_bd: 156, chotpoti: 98, jhal_muri: 165,
  dal_bhaat: 156, fish_curry_bd: 145, chicken_curry_bd: 165,
  mutton_curry: 198, beef_curry: 210, prawn_curry: 155,
  lau_curry: 65, pumpkin_curry: 72, bitter_gourd_curry: 35,
  okra_fry: 145, eggplant_curry: 85, potato_curry: 120,
  spinach_curry: 45, mixed_vegetable: 95, cabbage_fry: 65,
  khichdi_bd: 145, pulao_bd: 178, fried_rice_bd: 190,
  egg_roll: 215, meat_roll: 245, vegetable_roll: 180,
  shutki_curry: 125, mola_fish: 88, boal_fish: 105,
  rui_fish: 112, katla_fish: 118, pabda_fish: 108,
  mishti_doi: 165, payesh: 168, khiroharam: 145,
  jalebi_bd: 296, sandesh: 287, rasgolla_bd: 106,
  chandrapuli: 245, kalojam: 256, roshogolla: 106,
  bhorta: 85, bhuna_khichdi: 145, shutki_macher_jhol: 125,
  fuska_pani: 12, golgappa_bd: 150, pani_puri_bd: 145,
  haleem: 265, korma: 235, dopiaza: 175,
  achar: 85, pickle_bd: 95, lime_pickle: 75,
  
  // Bangladesh Street Food
  falooda_bd: 245, baraf_ka_gola: 95, mango_sorbet: 110,
  shaved_ice_bd: 12, falsa_juice: 45, sugarcane_juice: 55,
  
  // Sri Lankan Foods
  kottu_roti: 245, hoppers: 138, lamprais: 210,
  
  // South Indian Specialties
  idiyappam: 168, vada: 246, medu_vada: 260,
  appam: 145, puttu: 165,
  
  // North Indian Meat Dishes
  tandoori_chicken: 195, tikka_kebab: 180,
  
  // Legumes & Lentils
  moong_dal: 347, urad_dal: 341, masoor_dal: 353, toor_dal: 349,
  
  // Additional Subcontinental Items
  makhana: 106, sago: 335, vermicelli: 382,
  milk_powder: 496, panipuri_pani: 12, chaat_powder: 340,
};

// Helper function to convert grams to kcal
const gramsToKcal = (grams: number, foodName: string): number => {
  const cleanName = foodName.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
  const caloriesPer100g = FOOD_DATABASE[cleanName] || 0;
  return Math.round((grams * caloriesPer100g) / 100);
};

// --- 4. MAIN PAGE ---
const ReportPage = () => {
  const params = useParams();
  const typeParam = (params?.type as string)?.toLowerCase() || 'calories';
  const activeTab = (typeParam in CATEGORIES ? typeParam : 'calories') as CategoryKey;
  
  const [inputValue, setInputValue] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [foodSuggestions, setFoodSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gramInput, setGramInput] = useState("");
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [goalInput, setGoalInput] = useState("");

  // --- DATA STORAGE ---
  const [allData, setAllData] = useState<Record<CategoryKey, Entry[]>>({
    calories: [],
    water: [],
    steps: [],
    sleep: [],
    workout: [],
    weight: []
  });

  // --- CUSTOM GOALS STORAGE ---
  const [customGoals, setCustomGoals] = useState<Record<CategoryKey, number>>({
    calories: 2500,
    water: 3000,
    steps: 10000,
    sleep: 8,
    workout: 60,
    weight: 75
  });

  // Fetch real calorie data from API & Database
  useEffect(() => {
    // Load custom goals from localStorage
    const savedGoals = localStorage.getItem('fitSphereGoals');
    if (savedGoals) {
      try {
        setCustomGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error('Error parsing saved goals:', e);
      }
    }

    const fetchCalorieData = async () => {
      try {
        // First, try to load saved data from localStorage
        const savedData = localStorage.getItem('fitSphereData');
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            setAllData(parsedData);
            return; // Use saved data instead of fetching
          } catch (e) {
            console.error('Error parsing saved data:', e);
          }
        }

        // If no saved data, fetch from API
        const foods = ['chicken', 'wheat', 'rice', 'salmon', 'broccoli', 'banana'];
        const calorieMap: Record<string, number> = {};

        for (const food of foods) {
          try {
            // First try external API
            const response = await fetch(
              `https://www.nutritionix.com/api/v2/search/instant?query=${food}`,
              {
                headers: {
                  'x-app-id': 'b9a4bdea',
                  'x-app-key': '7e2e3c5e8b1f4d6a9c2e1b3a5f7d9e2c'
                }
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data.common && data.common.length > 0) {
                const item = data.common[0];
                calorieMap[food.charAt(0).toUpperCase() + food.slice(1)] = item.nf_calories || FOOD_DATABASE[food] || 0;
              } else {
                // Use database if API doesn't have the food
                calorieMap[food.charAt(0).toUpperCase() + food.slice(1)] = FOOD_DATABASE[food] || 0;
              }
            } else {
              // Use database as fallback
              calorieMap[food.charAt(0).toUpperCase() + food.slice(1)] = FOOD_DATABASE[food] || 0;
            }
          } catch (err) {
            // Use database on error
            calorieMap[food.charAt(0).toUpperCase() + food.slice(1)] = FOOD_DATABASE[food] || 0;
          }
        }

        const today = new Date().toISOString();
        const yesterday = new Date(Date.now() - 86400000).toISOString();
        const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();

        const initialData = {
          calories: [
            { id: '1', item: 'Rice', value: calorieMap['Rice'] || 130, date: twoDaysAgo },
            { id: '2', item: 'Chicken', value: calorieMap['Chicken'] || 165, date: yesterday },
            { id: '3', item: 'Wheat', value: calorieMap['Wheat'] || 340, date: yesterday },
            { id: '4', item: 'Salmon', value: calorieMap['Salmon'] || 208, date: today },
            { id: '5', item: 'Broccoli', value: calorieMap['Broccoli'] || 34, date: today },
            { id: '6', item: 'Banana', value: calorieMap['Banana'] || 89, date: today }
          ],
          water:    [{ id: '7', item: 'Bottle', value: 1000, date: yesterday }, { id: '8', item: 'Glass', value: 250, date: today }],
          steps:    [{ id: '9', item: 'Walk', value: 5000, date: yesterday }, { id: '10', item: 'Run', value: 8000, date: today }],
          sleep:    [{ id: '11', item: 'Night', value: 7, date: yesterday }],
          workout:  [{ id: '12', item: 'Gym', value: 45, date: yesterday }],
          weight:   [{ id: '13', item: 'Scale', value: 70, date: yesterday }, { id: '14', item: 'Scale', value: 69.5, date: today }]
        };

        setAllData(initialData);
        localStorage.setItem('fitSphereData', JSON.stringify(initialData));
      } catch (error) {
        console.error('Error loading calorie data:', error);
        const today = new Date().toISOString();
        const yesterday = new Date(Date.now() - 86400000).toISOString();
        const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();
        
        const fallbackData = {
          calories: [
            { id: '1', item: 'Rice', value: FOOD_DATABASE.rice, date: twoDaysAgo },
            { id: '2', item: 'Chicken', value: FOOD_DATABASE.chicken, date: yesterday },
            { id: '3', item: 'Wheat', value: FOOD_DATABASE.wheat, date: yesterday },
            { id: '4', item: 'Salmon', value: FOOD_DATABASE.salmon, date: today },
            { id: '5', item: 'Broccoli', value: FOOD_DATABASE.broccoli, date: today },
            { id: '6', item: 'Banana', value: FOOD_DATABASE.banana, date: today }
          ],
          water:    [{ id: '7', item: 'Bottle', value: 1000, date: yesterday }, { id: '8', item: 'Glass', value: 250, date: today }],
          steps:    [{ id: '9', item: 'Walk', value: 5000, date: yesterday }, { id: '10', item: 'Run', value: 8000, date: today }],
          sleep:    [{ id: '11', item: 'Night', value: 7, date: yesterday }],
          workout:  [{ id: '12', item: 'Gym', value: 45, date: yesterday }],
          weight:   [{ id: '13', item: 'Scale', value: 70, date: yesterday }, { id: '14', item: 'Scale', value: 69.5, date: today }]
        };
        
        setAllData(fallbackData);
        localStorage.setItem('fitSphereData', JSON.stringify(fallbackData));
      }
    };

    fetchCalorieData();
  }, []);

  // --- GET CURRENT CONTEXT ---
  const config = CATEGORIES[activeTab];
  const currentHistory = allData[activeTab];

  // --- CALCULATE TODAY'S TOTAL ---
  const getTodayTotal = () => {
    const todayStr = new Date().toDateString();
    const todayEntries = currentHistory.filter(e => new Date(e.date).toDateString() === todayStr);
    
    if (config.isSum) {
      return todayEntries.reduce((acc, curr) => acc + curr.value, 0);
    } else {
      return todayEntries.length > 0 ? todayEntries[todayEntries.length - 1].value : 0;
    }
  };

  const todayTotal = getTodayTotal();
  const currentGoal = customGoals[activeTab];
  const remaining = Math.max(0, currentGoal - todayTotal);

  // --- SAVE GOAL ---
  const saveGoal = () => {
    const newGoal = parseFloat(goalInput);
    if (newGoal > 0) {
      const updated = { ...customGoals, [activeTab]: newGoal };
      setCustomGoals(updated);
      localStorage.setItem('fitSphereGoals', JSON.stringify(updated));
      setShowGoalEdit(false);
      setGoalInput("");
    }
  };

  // --- PROCESS DATA FOR CHART ---
  const chartData = useMemo(() => {
    const daysMap = new Map<string, number>();
    const now = new Date();
    
    // Create last 5 days shell
    const result = [];
    for(let i=4; i>=0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const key = d.toDateString();
        daysMap.set(key, 0);
        result.push({ 
            dateKey: key, 
            label: i===0 ? 'Today' : d.toLocaleDateString('en-US',{weekday:'short'}), 
            value: 0 
        });
    }

    // Fill Data
    currentHistory.forEach(entry => {
        const dKey = new Date(entry.date).toDateString();
        if(daysMap.has(dKey)) {
            if(config.isSum) {
                // For Cal/Water/Steps -> Add them up
                daysMap.set(dKey, (daysMap.get(dKey) || 0) + entry.value);
            } else {
                // For Weight -> Take the latest value
                daysMap.set(dKey, entry.value);
            }
        }
    });

    return result.map(r => ({ ...r, value: daysMap.get(r.dateKey) || 0 }));
  }, [currentHistory, config]); // Re-runs ONLY when tab or data changes

  // --- ADD ENTRY FUNCTION ---
  const handleAdd = () => {
    if (activeTab === 'calories') {
      if (!gramInput || !inputDesc) return;
      const grams = parseFloat(gramInput);
      const kcal = gramsToKcal(grams, inputDesc);
      
      const newEntry: Entry = {
        id: Math.random().toString(36).substr(2, 9),
        item: inputDesc,
        date: new Date().toISOString(),
        value: kcal
      };

      setAllData(prev => {
        const updated = {
          ...prev,
          [activeTab]: [...prev[activeTab], newEntry]
        };
        localStorage.setItem('fitSphereData', JSON.stringify(updated));
        return updated;
      });

      setInputDesc("");
      setGramInput("");
      setFoodSuggestions([]);
    } else {
      // For other tabs (water, steps, weight, etc.)
      if (!inputValue) return;
      const val = parseFloat(inputValue);
      const desc = inputDesc || config.label;

      const newEntry: Entry = {
        id: Math.random().toString(36).substr(2, 9),
        item: desc,
        date: new Date().toISOString(),
        value: val
      };

      setAllData(prev => {
        const updated = {
          ...prev,
          [activeTab]: [...prev[activeTab], newEntry]
        };
        localStorage.setItem('fitSphereData', JSON.stringify(updated));
        return updated;
      });

      setInputValue("");
      setInputDesc("");
      setFoodSuggestions([]);
    }
  };

  // --- FOOD SEARCH SUGGESTIONS (for Calories tab) ---
  const handleFoodSearch = (query: string) => {
    setInputDesc(query);
    if (query.length > 0 && activeTab === 'calories') {
      const suggestions = Object.keys(FOOD_DATABASE)
        .filter(food => food.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setFoodSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setFoodSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // --- SELECT SUGGESTION ---
  const selectSuggestion = (food: string) => {
    const calories = FOOD_DATABASE[food] || 0;
    setInputDesc(food.replace(/_/g, ' ').charAt(0).toUpperCase() + food.slice(1).replace(/_/g, ' '));
    setInputValue(calories.toString());
    setGramInput("");
    setFoodSuggestions([]);
    setShowSuggestions(false);
  };

  // --- GRAM TO KCAL CONVERTER ---
  const handleGramInput = (grams: string) => {
    setGramInput(grams);
    if (activeTab === 'calories' && grams && inputDesc) {
      const gramValue = parseFloat(grams);
      const kcal = gramsToKcal(gramValue, inputDesc);
      setInputValue(kcal.toString());
    }
  };

  // --- DELETE ENTRY ---
  const deleteEntry = (id: string) => {
    setAllData(prev => {
      const updated = {
        ...prev,
        [activeTab]: prev[activeTab].filter(entry => entry.id !== id)
      };
      localStorage.setItem('fitSphereData', JSON.stringify(updated));
      return updated;
    });
  };

  // --- CLEAR ALL DATA ---
  const clearAllData = () => {
    if (confirm(`Are you sure you want to delete all ${config.label} entries?`)) {
      setAllData(prev => {
        const updated = {
          ...prev,
          [activeTab]: []
        };
        localStorage.setItem('fitSphereData', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <div className="report-container">
      <header className="header">
        <h1>{config.icon} <span style={{color: config.color}}>{config.label}</span></h1>
      </header>

      <div className="dashboard-grid">
        {/* --- THE GRAPH (Single Category) --- */}
        <div className="card chart-card">
           <div className="card-header">
             <h2>{config.label} Trend</h2>
             <span style={{color: config.color}}>Goal: {config.goal} {config.unit}</span>
           </div>
           <SmartGraph data={chartData} color={config.color} unit={config.unit} />
        </div>

        {/* --- THE FORM & HISTORY --- */}
        <div className="side-column">
           <div className="card form-card">
              <h2>Add {config.label}</h2>
              
              <div style={{
                background: `${config.color}20`,
                border: `2px solid ${config.color}`,
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                <small style={{color: '#aaa'}}>Today's Progress</small>
                <div style={{marginTop: '8px', display: 'flex', justifyContent: 'space-around'}}>
                  <div>
                    <div style={{fontSize: '20px', fontWeight: 'bold', color: config.color}}>
                      {todayTotal.toFixed(config.unit === 'kg' ? 1 : 0)}
                    </div>
                    <small style={{color: '#888'}}>Completed</small>
                  </div>
                  <div style={{borderLeft: `1px solid ${config.color}40`}}></div>
                  <div>
                    <div style={{fontSize: '20px', fontWeight: 'bold', color: config.color}}>
                      {remaining.toFixed(config.unit === 'kg' ? 1 : 0)}
                    </div>
                    <small style={{color: '#888'}}>Remaining</small>
                  </div>
                  <div style={{borderLeft: `1px solid ${config.color}40`}}></div>
                  <div style={{position: 'relative'}}>
                    <div 
                      style={{
                        fontSize: '20px', 
                        fontWeight: 'bold', 
                        color: config.color,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onClick={() => {
                        setShowGoalEdit(!showGoalEdit);
                        setGoalInput(currentGoal.toString());
                      }}
                      title="Click to edit goal"
                    >
                      {currentGoal} ✏️
                    </div>
                    <small style={{color: '#888'}}>Goal</small>
                    
                    {showGoalEdit && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '-40px',
                        background: '#1E1E1E',
                        border: `2px solid ${config.color}`,
                        borderRadius: '4px',
                        padding: '8px',
                        marginTop: '8px',
                        zIndex: 100,
                        minWidth: '120px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                      }}>
                        <input
                          type="number"
                          value={goalInput}
                          onChange={e => setGoalInput(e.target.value)}
                          placeholder="Enter goal"
                          style={{
                            width: '100%',
                            padding: '6px',
                            marginBottom: '8px',
                            background: '#2a2a2a',
                            border: `1px solid ${config.color}`,
                            color: config.color,
                            borderRadius: '4px'
                          }}
                        />
                        <div style={{display: 'flex', gap: '6px'}}>
                          <button
                            onClick={saveGoal}
                            style={{
                              flex: 1,
                              padding: '6px',
                              background: config.color,
                              color: '#000',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setShowGoalEdit(false)}
                            style={{
                              flex: 1,
                              padding: '6px',
                              background: '#444',
                              color: '#aaa',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                      value={inputDesc} 
                      onChange={e=>handleFoodSearch(e.target.value)}
                      onFocus={() => inputDesc.length > 0 && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder={activeTab === 'calories' ? 'e.g. Chicken, Rice, Paneer...' : activeTab === 'water' ? 'e.g. Glass, Bottle, Cup' : activeTab === 'sleep' ? 'e.g. Night sleep, Nap' : activeTab === 'steps' ? 'e.g. Morning walk, Evening run' : activeTab === 'workout' ? 'e.g. Gym, Yoga, Running' : 'e.g. Morning weigh-in'}
                  />
                  {showSuggestions && foodSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#222',
                      border: `1px solid ${config.color}`,
                      borderRadius: '4px',
                      marginTop: '5px',
                      zIndex: 1000,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}>
                      {foodSuggestions.map((food, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectSuggestion(food)}
                          style={{
                            padding: '10px 12px',
                            cursor: 'pointer',
                            borderBottom: idx < foodSuggestions.length - 1 ? `1px solid #444` : 'none',
                            fontSize: '14px',
                            textTransform: 'capitalize',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = config.color + '30'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          {food.replace(/_/g, ' ')} <span style={{ color: config.color, fontSize: '12px' }}>({FOOD_DATABASE[food]} kcal)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {activeTab === 'calories' && (
                <div className="form-group">
                  <label>Grams (Auto-calculates kcal)</label>
                  <input 
                      type="number" 
                      value={gramInput} 
                      onChange={e=>handleGramInput(e.target.value)} 
                      placeholder="Enter grams (e.g., 150)"
                  />
                  {gramInput && inputDesc && (
                    <small style={{color: config.color, marginTop: '5px', display: 'block'}}>
                      {gramInput}g of {inputDesc} = {gramsToKcal(parseFloat(gramInput), inputDesc)} kcal
                    </small>
                  )}
                </div>
              )}

              {activeTab !== 'calories' && (
                <div className="form-group">
                  <label>
                    {activeTab === 'water' ? 'Water in ml' : 
                     activeTab === 'sleep' ? 'Sleep in hours' : 
                     activeTab === 'steps' ? 'Steps' : 
                     activeTab === 'workout' ? 'Workout in minutes' : 
                     activeTab === 'weight' ? 'Weight in kg' : 
                     `Amount (${config.unit})`}
                  </label>
                  <input 
                      type="number" 
                      value={inputValue} 
                      onChange={e=>setInputValue(e.target.value)} 
                      placeholder={activeTab === 'water' ? 'e.g., 250 ml' : 
                                   activeTab === 'sleep' ? 'e.g., 7 hours' : 
                                   activeTab === 'steps' ? 'e.g., 10000' : 
                                   activeTab === 'workout' ? 'e.g., 45 minutes' : 
                                   activeTab === 'weight' ? 'e.g., 70 kg' : 
                                   '0'}
                      step={activeTab === 'weight' ? '0.1' : '1'}
                  />
                </div>
              )}

              <button 
                className="add-btn" 
                onClick={handleAdd}
                style={{ backgroundColor: config.color, color: '#000' }}
              >
                SAVE {config.label.toUpperCase()}
              </button>
           </div>

           <div className="card history-card" style={{marginTop:'20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                <h2 style={{margin: 0}}>Recent History</h2>
                {currentHistory.length > 0 && (
                  <button 
                    onClick={clearAllData}
                    style={{
                      background: '#ff4757',
                      border: 'none',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
              <ul className="entry-list">
                {currentHistory.slice().reverse().map(entry => (
                    <li key={entry.id} className="entry-item" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                        <div>
                          <span>{entry.item}</span>
                          <span style={{color: '#888', fontSize: '12px', marginLeft: '8px'}}>
                            {new Date(entry.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                          </span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                          <span style={{color: config.color, fontWeight:'bold'}}>
                              {entry.value} {config.unit}
                          </span>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ff4757',
                              cursor: 'pointer',
                              fontSize: '16px',
                              padding: '2px 6px'
                            }}
                            title="Delete entry"
                          >
                            ✕
                          </button>
                        </div>
                    </li>
                ))}
                {currentHistory.length === 0 && <li style={{color:'#666', textAlign:'center'}}>No Data</li>}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;