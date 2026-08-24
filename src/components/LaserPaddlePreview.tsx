import React from 'react';
import { ConfiguredBlind, MaterialInfo } from '../types';
import { MATERIALS } from '../data/paddleBlindData';
import { ShieldCheck, Flame, Cpu, Gauge } from 'lucide-react';

interface LaserPaddlePreviewProps {
  blind: ConfiguredBlind;
  millHeatNumber?: string;
}

export const LaserPaddlePreview: React.FC<LaserPaddlePreviewProps> = ({
  blind,
  millHeatNumber = 'HEAT-PENDING'
}) => {
  const { nps, pressureClass, material, facing, handleStamping, addOns, dimensions } = blind;
  const matInfo: MaterialInfo = MATERIALS[material];

  // Material gradient styles
  const getMaterialGradient = () => {
    switch (material) {
      case 'A516':
        return {
          fill: 'url(#grad-carbon-steel)',
          stroke: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.25)',
          edgeColor: '#d97706'
        };
      case '304L':
        return {
          fill: 'url(#grad-stainless-304)',
          stroke: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.25)',
          edgeColor: '#0ea5e9'
        };
      case '316L':
        return {
          fill: 'url(#grad-stainless-316)',
          stroke: '#60a5fa',
          glow: 'rgba(96, 165, 250, 0.25)',
          edgeColor: '#3b82f6'
        };
      case '6061':
        return {
          fill: 'url(#grad-aluminum)',
          stroke: '#34d399',
          glow: 'rgba(52, 211, 153, 0.25)',
          edgeColor: '#10b981'
        };
      default:
        return {
          fill: 'url(#grad-carbon-steel)',
          stroke: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.25)',
          edgeColor: '#d97706'
        };
    }
  };

  const matStyle = getMaterialGradient();

  // SVG Geometry calculations
  const centerX = 160;
  const centerY = 240;
  // Scale radius based on OD
  const radius = Math.min(105, Math.max(50, (dimensions.od / 24) * 65 + 40));
  const handleWidth = Math.max(24, Math.min(42, dimensions.handleWidth * 16));
  const handleLength = Math.max(90, Math.min(140, dimensions.handleLength * 12));
  const handleTopY = centerY - radius - handleLength + 30;

  // Stamped text
  const stampLine1 = `${nps} ${pressureClass} ${blind.material}`;
  const stampLine2 = handleStamping || `IPF-B16.48`;
  const stampLine3 = `HT: ${millHeatNumber}`;

  return (
    <div className="relative flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
      {/* Plasma Cut Status Badge */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-medium text-amber-400">
        <Flame className="h-3.5 w-3.5 animate-pulse text-amber-400" />
        <span>CNC PLASMA DIRECT CUT</span>
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span>ASME B16.48 SPEC</span>
      </div>

      {/* SVG Canvas */}
      <div className="relative my-4 flex h-80 w-full items-center justify-center">
        <svg
          viewBox="0 0 320 370"
          className="h-full w-full max-w-xs drop-shadow-[0_0_25px_rgba(0,0,0,0.8)]"
          aria-label={`ASME B16.48 Paddle Blind ${nps} ${pressureClass}`}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="grad-carbon-steel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="35%" stopColor="#1f2937" />
              <stop offset="70%" stopColor="#4b5563" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>

            <linearGradient id="grad-stainless-304" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="30%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="grad-stainless-316" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="40%" stopColor="#f1f5f9" />
              <stop offset="75%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <linearGradient id="grad-aluminum" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="45%" stopColor="#ffffff" />
              <stop offset="80%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* Plasma Burn Glow */}
            <filter id="plasma-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Hatching for RF serrations */}
            <pattern id="serration-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 0 3 L 6 3" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Caliper guide background lines */}
          <g opacity="0.25" stroke="#64748b" strokeDasharray="3 3">
            <line x1="20" y1={centerY} x2="300" y2={centerY} />
            <line x1={centerX} y1="30" x2={centerX} y2="350" />
          </g>

          {/* Lifting Lug Add-on (Rendered on top of handle or disc) */}
          {addOns.liftingLug && (
            <g className="transition-all duration-300">
              <path
                d={`M ${centerX - 16} ${handleTopY} L ${centerX - 16} ${handleTopY - 24} Q ${centerX} ${handleTopY - 38} ${centerX + 16} ${handleTopY - 24} L ${centerX + 16} ${handleTopY} Z`}
                fill={matStyle.fill}
                stroke={matStyle.stroke}
                strokeWidth="2"
              />
              <circle
                cx={centerX}
                cy={handleTopY - 20}
                r="7"
                fill="#0f172a"
                stroke={matStyle.stroke}
                strokeWidth="2"
              />
              <text
                x={centerX}
                y={handleTopY - 42}
                textAnchor="middle"
                className="fill-amber-400 text-[8px] font-mono uppercase"
              >
                LIFT LUG (3/4" EYE)
              </text>
            </g>
          )}

          {/* T-Handle Add-on */}
          {addOns.tHandle && (
            <g className="transition-all duration-300">
              <rect
                x={centerX - 46}
                y={handleTopY - (addOns.liftingLug ? 32 : 12)}
                width="92"
                height="10"
                rx="4"
                fill="#1e293b"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <circle cx={centerX - 40} cy={handleTopY - (addOns.liftingLug ? 27 : 7)} r="2" fill="#f59e0b" />
              <circle cx={centerX + 40} cy={handleTopY - (addOns.liftingLug ? 27 : 7)} r="2" fill="#f59e0b" />
              <text
                x={centerX}
                y={handleTopY - (addOns.liftingLug ? 36 : 16)}
                textAnchor="middle"
                className="fill-amber-400 text-[8px] font-mono uppercase font-bold"
              >
                T-HANDLE GRIP
              </text>
            </g>
          )}

          {/* Main Paddle Blind Geometry (Handle + Disc Path) */}
          <g filter="url(#plasma-glow)">
            {/* Paddle Handle */}
            <path
              d={`
                M ${centerX - handleWidth / 2} ${centerY}
                L ${centerX - handleWidth / 2} ${handleTopY + 12}
                Q ${centerX - handleWidth / 2} ${handleTopY} ${centerX - handleWidth / 2 + 10} ${handleTopY}
                L ${centerX + handleWidth / 2 - 10} ${handleTopY}
                Q ${centerX + handleWidth / 2} ${handleTopY} ${centerX + handleWidth / 2} ${handleTopY + 12}
                L ${centerX + handleWidth / 2} ${centerY}
                Z
              `}
              fill={matStyle.fill}
              stroke={matStyle.edgeColor}
              strokeWidth="2.5"
            />

            {/* Paddle Disc Body */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill={matStyle.fill}
              stroke={matStyle.edgeColor}
              strokeWidth="3"
            />
          </g>

          {/* Handle Hang Hole */}
          <circle
            cx={centerX}
            cy={handleTopY + 18}
            r={handleWidth * 0.18}
            fill="#090d16"
            stroke={matStyle.stroke}
            strokeWidth="1.5"
          />

          {/* Facing Details */}
          {facing === 'RF' && (
            <g>
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * 0.72}
                fill="url(#serration-pattern)"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * 0.45}
                fill="none"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
              />
            </g>
          )}

          {facing === 'RTJ' && (
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.65}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="2 1"
              opacity="0.8"
            />
          )}

          {/* Bolt Circle Alignment Ring Reference */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.88}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="0.8"
            strokeDasharray="3 4"
            opacity="0.5"
          />

          {/* Hard Stamped Text on Handle (Rotated vertically along the handle) */}
          <g
            transform={`translate(${centerX}, ${(centerY + handleTopY) / 2 + 10}) rotate(-90)`}
            className="select-none font-mono"
          >
            <text
              x="0"
              y="-5"
              textAnchor="middle"
              className="fill-amber-300 text-[9px] font-black tracking-widest"
              style={{ letterSpacing: '1.5px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              {stampLine1}
            </text>
            <text
              x="0"
              y="5"
              textAnchor="middle"
              className="fill-stone-200 text-[8px] font-bold tracking-wider"
              style={{ letterSpacing: '1px' }}
            >
              {stampLine2}
            </text>
            <text
              x="0"
              y="14"
              textAnchor="middle"
              className="fill-emerald-400 text-[7px] font-mono"
              style={{ letterSpacing: '0.8px' }}
            >
              {stampLine3}
            </text>
          </g>

          {/* Center Crosshairs */}
          <g stroke="rgba(255,255,255,0.3)" strokeWidth="1">
            <line x1={centerX - 8} y1={centerY} x2={centerX + 8} y2={centerY} />
            <line x1={centerX} y1={centerY - 8} x2={centerX} y2={centerY + 8} />
          </g>

          {/* Dimension Caliper Labels */}
          {/* OD Dimension */}
          <g className="font-mono text-[9px]">
            <line
              x1={centerX - radius}
              y1={centerY + radius + 14}
              x2={centerX + radius}
              y2={centerY + radius + 14}
              stroke="#f59e0b"
              strokeWidth="1.2"
            />
            <line
              x1={centerX - radius}
              y1={centerY + radius + 8}
              x2={centerX - radius}
              y2={centerY + radius + 20}
              stroke="#f59e0b"
              strokeWidth="1.2"
            />
            <line
              x1={centerX + radius}
              y1={centerY + radius + 8}
              x2={centerX + radius}
              y2={centerY + radius + 20}
              stroke="#f59e0b"
              strokeWidth="1.2"
            />
            <text
              x={centerX}
              y={centerY + radius + 28}
              textAnchor="middle"
              className="fill-amber-400 font-bold"
            >
              OD: {dimensions.od.toFixed(3)}" ({nps} NPS)
            </text>
          </g>
        </svg>
      </div>

      {/* Live Spec Monospace Bar */}
      <div className="grid w-full grid-cols-2 gap-2 border-t border-slate-800/80 pt-3 text-xs sm:grid-cols-4">
        <div className="rounded-lg bg-slate-900/90 p-2 text-center border border-slate-800">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Plate Thickness</div>
          <div className="mt-0.5 font-mono font-bold text-amber-400">
            {dimensions.thicknessFraction} ({dimensions.nominalThickness.toFixed(3)}")
          </div>
        </div>

        <div className="rounded-lg bg-slate-900/90 p-2 text-center border border-slate-800">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Bolt Circle</div>
          <div className="mt-0.5 font-mono font-bold text-sky-400">
            {dimensions.boltCircle.toFixed(3)}" BC
          </div>
        </div>

        <div className="rounded-lg bg-slate-900/90 p-2 text-center border border-slate-800">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Finished Weight</div>
          <div className="mt-0.5 font-mono font-bold text-emerald-400">
            {blind.finishedWeightPerUnit} lbs / ea
          </div>
        </div>

        <div className="rounded-lg bg-slate-900/90 p-2 text-center border border-slate-800">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">SKU Taxonomy</div>
          <div className="mt-0.5 font-mono text-[11px] font-bold text-stone-200 truncate" title={blind.sku}>
            {blind.sku}
          </div>
        </div>
      </div>
    </div>
  );
};
