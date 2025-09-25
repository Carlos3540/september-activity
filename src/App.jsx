import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import logo from "./assets/logotranpa-StyleColor.png";
import './App.css'

const MOODS = {
  happy: { 
    name: 'Feliz', 
    icon: '😊', 
    colors: ['#FFD93D', '#6BCF7F', '#4D96FF', '#FF6B6B'],
    description: 'Colores brillantes y energéticos'
  },
  calm: { 
    name: 'Tranquilo', 
    icon: '😌', 
    colors: ['#A8E6CF', '#88D8B0', '#68C4AF', '#4ECDC4'],
    description: 'Tonos suaves y relajantes'
  },
  energetic: { 
    name: 'Energético', 
    icon: '⚡', 
    colors: ['#FF6B6B', '#FF8E53', '#FF6B9D', '#C44569'],
    description: 'Colores vibrantes y dinámicos'
  },
  creative: { 
    name: 'Creativo', 
    icon: '🎨', 
    colors: ['#A8E6CF', '#FFD93D', '#FF8A80', '#B39DDB'],
    description: 'Mezcla inspiradora y única'
  },
  focus: { 
    name: 'Concentrado', 
    icon: '🎯', 
    colors: ['#78909C', '#90A4AE', '#607D8B', '#546E7A'],
    description: 'Tonos neutros que no distraen'
  }
}

function ColorCard({ color, isAnimating }) {
  return (
    <div 
      className={`relative rounded-xl shadow-lg transition-all duration-500 transform ${
        isAnimating ? 'scale-110 rotate-1' : 'hover:scale-105'
      }`}
      style={{ 
        backgroundColor: color,
        height: '120px'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 rounded-xl flex items-center justify-center">
        <span className="text-white font-mono text-sm bg-black bg-opacity-50 px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
          {color}
        </span>
      </div>
    </div>
  )
}

function App() {
  const [currentMood, setCurrentMood] = useState('happy')
  const [currentColors, setCurrentColors] = useState(MOODS.happy.colors)
  const [isGenerating, setIsGenerating] = useState(false)
  const [colorHistory, setColorHistory] = useState([])

  const adjustColorBrightness = (hex, percent) => {
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)
  }

  const generateColorsForMood = (mood) => {
    const baseColors = MOODS[mood].colors
    const newColors = []
    
    for (let i = 0; i < 4; i++) {
      if (Math.random() > 0.3) {
        newColors.push(baseColors[i % baseColors.length])
      } else {
        const baseColor = baseColors[i % baseColors.length]
        const variation = adjustColorBrightness(baseColor, (Math.random() - 0.5) * 40)
        newColors.push(variation)
      }
    }
    
    return newColors
  }

  const handleGenerateColors = () => {
    setIsGenerating(true)
    const newColors = generateColorsForMood(currentMood)
    
    setTimeout(() => {
      setCurrentColors(newColors)
      setColorHistory(prev => [
        { mood: currentMood, colors: newColors, timestamp: Date.now() },
        ...prev.slice(0, 4)
      ])
      setIsGenerating(false)
    }, 500)
  }

  const changeMood = (mood) => {
    setCurrentMood(mood)
    setCurrentColors(generateColorsForMood(mood))
  }

  useEffect(() => {
    setCurrentColors(generateColorsForMood(currentMood))
  }, [])

  const copyToClipboard = (colors) => {
    const colorString = colors.join(', ')
    navigator.clipboard?.writeText(colorString)
  }

  return (
    <div 
      className="min-h-screen transition-all duration-1000 p-6"
      style={{
        background: `linear-gradient(135deg, ${currentColors[0]}20, ${currentColors[1]}20)`
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div style={{ textAlign: "center", padding: "2rem" }}>
      <img 
        src={logo} 
        alt="Logo" 
        style={{ width: "150px", marginBottom: "1rem" }} 
      />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Bienvenidos a Style Color
          </h1>
          <p className="text-gray-600">
            Genera paletas de colores que reflejen cómo te sientes
          </p>
        </div>
        </div>

        {/* Mood Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            ¿Cómo te sientes hoy?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(MOODS).map(([key, mood]) => (
              <button
                key={key}
                onClick={() => changeMood(key)}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  currentMood === key 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-2">{mood.icon}</div>
                <div className="font-medium text-gray-800 text-sm">{mood.name}</div>
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            {MOODS[currentMood].description}
          </p>
        </div>

        {/* Color Palette */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Tu Paleta {MOODS[currentMood].name}
            </h2>
            <button
              onClick={handleGenerateColors}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all"
            >
              <span className={isGenerating ? 'animate-spin' : ''}>🔄</span>
              <span>Nueva Paleta</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {currentColors.map((color, index) => (
              <ColorCard 
                key={`${color}-${index}`} 
                color={color} 
                isAnimating={isGenerating}
              />
            ))}
          </div>

          <button
            onClick={() => copyToClipboard(currentColors)}
            className="w-full py-2 text-sm text-gray-600 hover:text-blue-600 border border-dashed border-gray-300 hover:border-blue-300 rounded-lg transition-all"
          >
            Hacer clic para copiar colores: {currentColors.join(' • ')}
          </button>
        </div>

        {/* History */}
        {colorHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Paletas Recientes
            </h2>
            <div className="space-y-3">
              {colorHistory.map((entry, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentColors(entry.colors)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                >
                  <span className="text-lg">{MOODS[entry.mood].icon}</span>
                  <div className="flex space-x-2 flex-1">
                    {entry.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {MOODS[entry.mood].name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Cada paleta es única • Perfecta para diseño e inspiración</p>
        </div>
      </div>
    </div>
  )
};

export default App;
