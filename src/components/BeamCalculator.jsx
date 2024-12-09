import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { generateDeflectionPoints } from '../utils/beamCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BeamCalculator() {
  const [params, setParams] = useState({
    E: 200e9,  // Modulus of elasticity in Pascals (200 GPa)
    I: 0.001,  // Moment of inertia in m^4
    w: 5e3,    // Load in N/m (5 kN/m)
    L: 6       // Length of the beam in meters
  });

  const [deflectionData, setDeflectionData] = useState(null);

  useEffect(() => {
    const points = generateDeflectionPoints(params.E, params.I, params.w, params.L);
    
    const data = {
      labels: points.map(p => p.x.toFixed(2)),
      datasets: [{
        label: 'Beam Deflection',
        data: points.map(p => p.y),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    setDeflectionData(data);
  }, [params]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Beam Deflection Graph'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Position along beam (m)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Deflection (m)'
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Beam Deflection Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Modulus of Elasticity (E) in Pa
            </label>
            <input
              type="number"
              name="E"
              value={params.E}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Moment of Inertia (I) in m⁴
            </label>
            <input
              type="number"
              name="I"
              value={params.I}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Load (w) in N/m
            </label>
            <input
              type="number"
              name="w"
              value={params.w}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Beam Length (L) in m
            </label>
            <input
              type="number"
              name="L"
              value={params.L}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <div className="space-y-2">
            <p>Maximum Deflection: {deflectionData ? 
              Math.min(...deflectionData.datasets[0].data).toExponential(4) : 0} m</p>
            <p>At midspan (x = {params.L/2} m): {
              deflectionData ? 
              generateDeflectionPoints(params.E, params.I, params.w, params.L)
                .find(p => Math.abs(p.x - params.L/2) < 0.1)?.y.toExponential(4) 
              : 0
            } m</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        {deflectionData && <Line data={deflectionData} options={chartOptions} />}
      </div>
    </div>
  );
}