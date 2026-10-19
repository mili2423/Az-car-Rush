'use client';

import React from 'react';
import { CandyModal, CandyButton } from '@/components/ui/design-system';
import { Play, RotateCcw, Home, Volume2, VolumeX, BookOpen, AlertCircle } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRetry: () => void;
  onOpenRecipes: () => void;
  onReturnHome: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  levelNumber: number;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRetry,
  onOpenRecipes,
  onReturnHome,
  isMuted,
  onToggleMute,
  levelNumber,
}) => {
  const [showConfirmHome, setShowConfirmHome] = React.useState(false);

  // Cada vez que se cierra o vuelve a abrir la pausa, resetear el diálogo de confirmación
  React.useEffect(() => {
    if (!isOpen) {
      setShowConfirmHome(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Modal Principal de Pausa */}
      <CandyModal
        isOpen={isOpen && !showConfirmHome}
        onClose={onResume}
        title="Juego Pausado"
        subtitle={`Día ${levelNumber} en pausa. ¡Tómate un respiro dulce!`}
        icon={<div className="text-3xl">⏸️</div>}
        maxWidth="sm"
        showCloseButton={false}
      >
        <div className="flex flex-col gap-2.5">
          {/* Continuar jugando (Botón principal destacado) */}
          <CandyButton
            variant="primary"
            size="lg"
            fullWidth
            icon={<Play className="w-5 h-5 fill-white ml-0.5" />}
            onClick={onResume}
          >
            Continuar Jugando
          </CandyButton>

          {/* Volver al home (Variante secundaria con ícono de casita) */}
          <CandyButton
            variant="secondary"
            size="md"
            fullWidth
            icon={<Home className="w-4 h-4 text-pink-600" />}
            onClick={() => setShowConfirmHome(true)}
          >
            Volver al home
          </CandyButton>

          {/* Reintentar nivel */}
          <CandyButton
            variant="warning"
            size="md"
            fullWidth
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={onRetry}
          >
            Reiniciar Día {levelNumber}
          </CandyButton>

          {/* Recetas y Sonido en grilla de 2 columnas táctiles */}
          <div className="grid grid-cols-2 gap-2 mt-0.5">
            <CandyButton
              variant="neutral"
              size="md"
              icon={<BookOpen className="w-4 h-4 text-amber-700" />}
              onClick={onOpenRecipes}
            >
              Recetas
            </CandyButton>

            <CandyButton
              variant="neutral"
              size="md"
              icon={
                isMuted ? (
                  <VolumeX className="w-4 h-4 text-stone-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-pink-600" />
                )
              }
              onClick={onToggleMute}
            >
              {isMuted ? 'Sonido: No' : 'Sonido: Sí'}
            </CandyButton>
          </div>
        </div>
      </CandyModal>

      {/* 2. Modal de Confirmación para Volver al Inicio */}
      {showConfirmHome && (
        <CandyModal
          isOpen={showConfirmHome}
          onClose={() => setShowConfirmHome(false)}
          title="¿Volver al inicio?"
          subtitle="Vas a perder el progreso de este día"
          icon={<AlertCircle className="w-8 h-8 text-amber-500" />}
          maxWidth="sm"
          showCloseButton={false}
        >
          <div className="flex flex-col gap-2.5 mt-2">
            {/* Confirmar salida */}
            <CandyButton
              variant="danger"
              size="md"
              fullWidth
              icon={<Home className="w-4 h-4" />}
              onClick={() => {
                setShowConfirmHome(false);
                onReturnHome();
              }}
            >
              Salir al home
            </CandyButton>

            {/* Cancelar (vuelve a la pausa) */}
            <CandyButton
              variant="neutral"
              size="md"
              fullWidth
              onClick={() => setShowConfirmHome(false)}
            >
              Cancelar
            </CandyButton>
          </div>
        </CandyModal>
      )}
    </>
  );
};
