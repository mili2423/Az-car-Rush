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

      {/* Pointer Lock Resume Overlay (when paused or lost focus) */}
      {!isLocked && (
        <div
          onClick={() => {
            const canvas = document.querySelector('canvas');
            canvas?.requestPointerLock();
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer transition-all duration-300"
        >
          <div className="bg-white/95 border-2 border-pink-400 p-8 rounded-3xl shadow-2xl text-center max-w-md transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl mb-3 animate-bounce">👩‍🍳</div>
            <h3 className="text-2xl font-black text-amber-900 mb-2 font-display">
              Haz clic para jugar
            </h3>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              Bloquea el cursor para mirar en primera persona con el mouse y moverte con <span className="font-bold text-pink-600">WASD</span>.
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-2.5 px-6 rounded-full shadow-lg">
              <span>Continuar en la Pastelería</span>
              <kbd className="bg-white/20 px-2 py-0.5 rounded text-xs">CLICK</kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
