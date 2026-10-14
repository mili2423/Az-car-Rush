'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { BakeryRoom } from './BakeryRoom';
import { Stations } from './Stations';
import { Customer3D } from './Customer3D';
import { PlayerController } from './PlayerController';
import { HeldItem3D } from './HeldItem3D';
import { CustomerOrder, OvenState, TrayState, TableState } from '@/types/game';

interface BakerySceneProps {
  ovenState: OvenState;
  isMixerActive: boolean;
  currentOrder: CustomerOrder | null;
  focusedObject: string | null;
  walkSpeedBonus: number;
  tray: TrayState;
  tableState: TableState;
  onFocusChange: (objectName: string | null) => void;
  onInteract: () => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  isPaused?: boolean;
}

export const BakeryScene: React.FC<BakerySceneProps> = ({
  ovenState,
  isMixerActive,
  currentOrder,
  focusedObject,
  walkSpeedBonus,
  tray,
  tableState,
  onFocusChange,
  onInteract,
  isLocked,
  setIsLocked,
  isPaused = false,
}) => {
  const [isMoving, setIsMoving] = useState(false);

  return (
    <div className="relative w-full h-full select-none">
      <Canvas
        shadows
        camera={{ position: [0, 1.7, 0], fov: 72 }}
        className="w-full h-full cursor-crosshair"
      >
        <Suspense fallback={null}>
          <BakeryRoom />
          <Stations
            ovenState={ovenState}
            isMixerActive={isMixerActive}
            focusedObject={focusedObject}
            tableState={tableState}
          />
          <Customer3D currentOrder={currentOrder} />
          
          {/* 3D Held Viewmodel in First Person (Hands + Tray + Item) */}
          <HeldItem3D tray={tray} isMoving={isMoving} />

          {/* First Person Movement & Pointer Lock */}
          <PlayerController
            walkSpeedBonus={walkSpeedBonus}
            onFocusChange={onFocusChange}
            onInteract={onInteract}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            onMoveChange={setIsMoving}
          />
        </Suspense>
      </Canvas>

      {/* Pointer Lock Resume Overlay (when lost focus, but not when paused) */}
      {!isLocked && !isPaused && (
        <div
          onClick={() => {
            const canvas = document.querySelector('canvas');
            canvas?.requestPointerLock();
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/65 backdrop-blur-sm cursor-pointer select-none transition-all duration-300 p-4"
        >
          <div className="relative flex flex-col items-center bg-[#fffbf7] border-4 border-pink-300 p-8 rounded-3xl shadow-2xl text-center max-w-sm sm:max-w-md transform hover:scale-[1.02] transition-transform duration-200 animate-scale-in">
            {/* Top gloss strip */}
            <div className="absolute top-0 left-6 right-6 h-1.5 bg-gradient-to-r from-pink-400 via-purple-400 to-amber-300 rounded-b-full pointer-events-none" />

            <div className="text-4xl mb-2 animate-bounce">👩‍🍳</div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#451a03] mb-1 tracking-tight">
              Haz clic para jugar
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-5 font-semibold leading-relaxed">
              Bloquea el cursor para mirar en 360° con el mouse y moverte por la cocina con <strong className="text-pink-600 font-black">WASD</strong>.
            </p>
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white font-black text-sm py-3 px-6 rounded-full border-2 border-pink-200/70 shadow-[0_4px_0_#9d174d,0_8px_20px_rgba(219,39,119,0.35)] transition-transform hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#9d174d]">
              <span>Continuar en la Pastelería</span>
              <kbd className="bg-white/25 px-2 py-0.5 rounded text-[11px] font-mono shadow-2xs">CLICK</kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
