// src/components/PaddleBlindVisualizer.tsx
// Interactive 2D/3D CAD ASME B16.48 Paddle Blind SVG Visualizer

import React from 'react';
import { PressureClass, MaterialCode, FacingType } from '../types';
import { FileText } from 'lucide-react';

interface PaddleBlindVisualizerProps {
  nps: string;
  pressureClass: PressureClass;
  materialCode: MaterialCode;
  thicknessLabel: string;
  facing: FacingType;
  handleStamp: string;
  addTHadle: boolean;
  addLockoutHole?: boolean;
  addLiftingLug: boolean;
  od: number;
  thickness: number;
  blindType?: string;
}

export const PaddleBlindVisualizer: React.FC<PaddleBlindVisualizerProps> = ({
  nps,
  pressureClass,
  materialCode,
  thicknessLabel,
  facing,
  handleStamp,
  addTHadle,
  addLockoutHole = false,
  addLiftingLug,
  od,
  thickness,
  blindType = 'Paddle Blind',
}) => {
  let metalShader = {
    fill: 'url(#metal-sa516)',
    edge: '#1e293b',
    specular: '#64748b',
    border: '#334155',
    stampingColor: '#1e293b',
    specText: 'ASME SA-516 Gr. 70 (PVQ Plate)',
    densityLabel: '0.284 lb/in³ Domestic Boiler Plate'
  };

  if (materialCode === 'SA-36') {
    metalShader = {
      fill: 'url(#metal-sa36)',
      edge: '#334155',
      specular: '#94a3b8',
      border: '#475569',
      stampingColor: '#0f172a',
      specText: 'ASME SA-36 / ASTM A36 Carbon Steel',
      densityLabel: '0.284 lb/in³ Structural Carbon'
    };
  } else if (materialCode === '304' || materialCode === '304L') {
    metalShader = {
      fill: 'url(#metal-ss304)',
      edge: '#64748b',
      specular: '#f8fafc',
      border: '#94a3b8',
      stampingColor: '#334155',
      specText: 'ASTM A240 304/304L Dual-Cert Stainless',
      densityLabel: '0.290 lb/in³ Low-Carbon Austenitic'
    };
  } else if (materialCode === '316L') {
    metalShader = {
      fill: 'url(#metal-ss316)',
      edge: '#64748b',
      specular: '#ffffff',
      border: '#94a3b8',
      stampingColor: '#1e293b',
      specText: 'ASTM A240 316L Acid/Marine Stainless',
      densityLabel: '0.290 lb/in³ Molybdenum Corrosion Res.'
    };
  } else if (materialCode === 'AL-6061') {
    metalShader = {
      fill: 'url(#metal-al6061)',
      edge: '#94a3b8',
      specular: '#ffffff',
      border: '#cbd5e1',
      stampingColor: '#475569',
      specText: 'ASTM B209 6061-T6 High-Strength Aluminum',
      densityLabel: '0.098 lb/in³ Light Alloy Plate'
    };
  }

  const centerX = 200;
  const centerY = 250;
  const radius = Math.min(85, Math.max(50, (od / 24) * 45 + 40));
  const handleWidth = Math.max(28, Math.min(42, (od * 0.25) * 8 + 20));
  const handleLength = Math.max(90, Math.min(130, (od * 0.25) * 10 + 75));
  const handleTopY = centerY - radius - handleLength + 30;

  const tHandleSpan = Math.max(120, Math.min(180, handleWidth * 3.8));
  const tHandleThick = 24;
  const tHandleLeft = centerX - tHandleSpan / 2;
  const tHandleRight = centerX + tHandleSpan / 2;
  const tHandleY = handleTopY - 4;

  const lugTopY = (addTHadle ? tHandleY : handleTopY) - 28;
  const extrudeOffset = Math.min(8, Math.max(3, thickness * 8 + 2));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-600 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            ASME B16.48 Live CAD Preview
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 text-sky-900 px-2.5 py-0.5 rounded-full border border-slate-200 font-bold">
          <span>{nps} NPS</span>
          <span className="text-slate-300">&bull;</span>
          <span>{pressureClass}#</span>
          <span className="text-slate-300">&bull;</span>
          <span>{materialCode}</span>
        </div>
      </div>

      <div className="relative bg-slate-50/90 border border-slate-200 rounded-xl p-2 overflow-hidden flex items-center justify-center min-h-[340px]">
        <div className="absolute top-2.5 left-3 text-[10px] font-mono text-slate-600 font-semibold tracking-wider flex items-center gap-1.5 pointer-events-none">
          <FileText className="h-3 w-3 text-slate-600" />
          <span>IRON PRAIRIE CNC PLASMA PROFILE &bull; 1:1 CAD GEOMETRY</span>
        </div>

        <div className="absolute top-2.5 right-3 flex flex-col items-end gap-1 pointer-events-none">
          {addTHadle && (
            <div className="text-[10px] font-mono text-sky-950 font-extrabold bg-sky-100 border border-sky-300 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <span>⚙️ INTEGRAL CNC T-HANDLE (1-PIECE NO WELDS)</span>
            </div>
          )}
          {addLockoutHole && (
            <div className="text-[10px] font-mono text-amber-950 font-extrabold bg-amber-100 border border-amber-300 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <span>🔒 3/8" CENTER LOCKOUT HOLE</span>
            </div>
          )}
        </div>

        <svg viewBox="0 0 400 390" className="w-full max-w-[340px] h-[320px] drop-shadow-md">
          <defs>
            <pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.18)" strokeWidth="0.75" />
            </pattern>

            <linearGradient id="metal-sa516" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="25%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="85%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="metal-sa36" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="35%" stopColor="#94a3b8" />
              <stop offset="70%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="metal-ss304" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="20%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#cbd5e1" />
              <stop offset="75%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <linearGradient id="metal-ss316" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="25%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="80%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="metal-al6061" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#f1f5f9" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <pattern id="machined-serrations" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2.5" fill="none" stroke="rgba(217, 119, 6, 0.45)" strokeWidth="0.8" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#cad-grid)" />

          <g stroke="#94a3b8" strokeDasharray="4 3" strokeWidth="0.8" opacity="0.4">
            <line x1="20" y1={centerY} x2="380" y2={centerY} />
            <line x1={centerX} y1="20" x2={centerX} y2="370" />
          </g>

          {/* 3D shadow */}
          <g transform={`translate(${extrudeOffset}, ${extrudeOffset})`} opacity="0.45">
            <circle cx={centerX} cy={centerY} r={radius} fill="#020617" />
            <path
              d={`
                M ${centerX - handleWidth / 2} ${centerY}
                L ${centerX - handleWidth / 2} ${handleTopY}
                L ${centerX + handleWidth / 2} ${handleTopY}
                L ${centerX + handleWidth / 2} ${centerY}
                Z
              `}
              fill="#020617"
            />
            {addTHadle && (
              <rect
                x={tHandleLeft}
                y={tHandleY}
                width={tHandleSpan}
                height={tHandleThick}
                rx="6"
                fill="#020617"
              />
            )}
            {addLiftingLug && (
              <path
                d={`M ${centerX - 18} ${addTHadle ? tHandleY : handleTopY} L ${centerX - 18} ${lugTopY + 12} Q ${centerX} ${lugTopY} ${centerX + 18} ${lugTopY + 12} L ${centerX + 18} ${addTHadle ? tHandleY : handleTopY} Z`}
                fill="#020617"
              />
            )}
          </g>

          {/* Body */}
          <g id="paddle-blind-steel-body">
            <path
              d={`
                M ${centerX - handleWidth / 2} ${centerY}
                L ${centerX - handleWidth / 2} ${handleTopY + 8}
                Q ${centerX - handleWidth / 2} ${handleTopY} ${centerX - handleWidth / 2 + 8} ${handleTopY}
                L ${centerX + handleWidth / 2 - 8} ${handleTopY}
                Q ${centerX + handleWidth / 2} ${handleTopY} ${centerX + handleWidth / 2} ${handleTopY + 8}
                L ${centerX + handleWidth / 2} ${centerY}
                Z
              `}
              fill={metalShader.fill}
              stroke={metalShader.border}
              strokeWidth="2.5"
            />

            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill={metalShader.fill}
              stroke={metalShader.border}
              strokeWidth="2.5"
            />

            <circle
              cx={centerX}
              cy={centerY}
              r={radius - 2}
              fill="none"
              stroke={metalShader.specular}
              strokeWidth="1"
              opacity="0.6"
            />
          </g>

          {/* T-Handle - Integral 1-Piece CNC Plasma Cut Profile */}
          {addTHadle ? (
            <g id="physical-t-handle-assembly" className="transition-all duration-300">
              {/* Integral Gusset/Bridge transition */}
              <path
                d={`
                  M ${tHandleLeft} ${tHandleY + tHandleThick}
                  L ${centerX - handleWidth / 2} ${tHandleY + tHandleThick}
                  L ${centerX - handleWidth / 2} ${tHandleY + tHandleThick + 8}
                  L ${centerX + handleWidth / 2} ${tHandleY + tHandleThick + 8}
                  L ${centerX + handleWidth / 2} ${tHandleY + tHandleThick}
                  L ${tHandleRight} ${tHandleY + tHandleThick}
                  Q ${tHandleRight + 6} ${tHandleY + tHandleThick} ${tHandleRight + 6} ${tHandleY + tHandleThick - 6}
                  L ${tHandleRight + 6} ${tHandleY + 6}
                  Q ${tHandleRight + 6} ${tHandleY} ${tHandleRight} ${tHandleY}
                  L ${tHandleLeft} ${tHandleY}
                  Q ${tHandleLeft - 6} ${tHandleY} ${tHandleLeft - 6} ${tHandleY + 6}
                  L ${tHandleLeft - 6} ${tHandleY + tHandleThick - 6}
                  Q ${tHandleLeft - 6} ${tHandleY + tHandleThick} ${tHandleLeft} ${tHandleY + tHandleThick}
                  Z
                `}
                fill={metalShader.fill}
                stroke={metalShader.border}
                strokeWidth="2.5"
              />

              <circle
                cx={centerX}
                cy={tHandleY + tHandleThick / 2}
                r={handleWidth * 0.22}
                fill="#0f172a"
                stroke={metalShader.border}
                strokeWidth="1.8"
              />
            </g>
          ) : (
            <g id="standard-asme-handle-hole">
              <circle
                cx={centerX}
                cy={handleTopY + 16}
                r={handleWidth * 0.22}
                fill="#0f172a"
                stroke={metalShader.border}
                strokeWidth="1.8"
              />
            </g>
          )}

          {/* 3/8" Center Safety Lockout / Tagout Hole */}
          {addLockoutHole && (
            <g id="center-safety-lockout-hole" className="transition-all duration-300">
              <circle
                cx={centerX}
                cy={centerY}
                r={7.5}
                fill="#0f172a"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={14}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.85"
              />
              <text
                x={centerX}
                y={centerY + 24}
                textAnchor="middle"
                className="fill-amber-700 font-mono font-bold text-[8.5px]"
              >
                3/8" LOCKOUT
              </text>
            </g>
          )}

          {/* Lifting Lug */}
          {addLiftingLug && (
            <g id="welded-lifting-lug-assembly">
              <path
                d={`
                  M ${centerX - 18} ${addTHadle ? tHandleY : handleTopY}
                  L ${centerX - 18} ${lugTopY + 12}
                  Q ${centerX} ${lugTopY} ${centerX + 18} ${lugTopY + 12}
                  L ${centerX + 18} ${addTHadle ? tHandleY : handleTopY}
                  Z
                `}
                fill={metalShader.fill}
                stroke="#d97706"
                strokeWidth="2"
              />
              <circle
                cx={centerX}
                cy={lugTopY + 14}
                r="7.5"
                fill="#0f172a"
                stroke="#d97706"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Facing */}
          {facing === 'Machined Gasket Finish (Special Order)' ? (
            <g id="machined-facing-surface">
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * 0.78}
                fill="url(#machined-serrations)"
                stroke="#d97706"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            </g>
          ) : (
            <g id="flat-face-smooth-surface">
              <circle
                cx={centerX}
                cy={centerY}
                r={radius * 0.78}
                fill="none"
                stroke={metalShader.specular}
                strokeWidth="1.2"
                strokeDasharray="6 3"
                opacity="0.7"
              />
            </g>
          )}

          {/* Handle text */}
          <g
            transform={`translate(${centerX + 2.5}, ${handleTopY + (addTHadle ? 34 : 26)}) rotate(90)`}
            id="handle-plasma-stamping"
          >
            <text
              x="0"
              y="0"
              className="fill-slate-900 font-mono font-extrabold text-[7.5px] tracking-wider"
            >
              IRON PRAIRIE &bull; {nps} {pressureClass}# {materialCode}
            </text>
          </g>

          {/* OD Dimension Caliper */}
          <g stroke="#64748b" strokeWidth="0.8" opacity="0.7">
            <line x1={centerX - radius} y1={centerY + radius + 14} x2={centerX + radius} y2={centerY + radius + 14} />
            <line x1={centerX - radius} y1={centerY + radius + 8} x2={centerX - radius} y2={centerY + radius + 20} />
            <line x1={centerX + radius} y1={centerY + radius + 8} x2={centerX + radius} y2={centerY + radius + 20} />
            <text
              x={centerX}
              y={centerY + radius + 26}
              textAnchor="middle"
              className="fill-slate-800 font-mono font-bold text-[9.5px]"
              stroke="none"
            >
              {od.toFixed(2)}" OD &bull; {thicknessLabel} Nominal Thk
            </text>
          </g>
        </svg>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-slate-700">
        <div>
          <span className="text-slate-900 font-bold block">{metalShader.specText}</span>
          <span className="text-[11px] text-slate-500">{metalShader.densityLabel}</span>
        </div>
        <div className="text-right sm:text-right">
          <span className="text-sky-800 font-bold block">ASME B16.48 Standard</span>
          <span className="text-[11px] text-slate-500">High-Definition CNC Plasma Tolerance</span>
        </div>
      </div>
    </div>
  );
};
