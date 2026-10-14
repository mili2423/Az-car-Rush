'use client';

import React from 'react';
import { CandyModal, CandyButton, CandyCard } from '@/components/ui/design-system';
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

  if (!isOpen) return null;

  return (
    <>
      <CandyModal
        isOpen={isOpen && !showConfirmHome}
        onClose={onResume}
        title="Juego Pausado"
        subtitle={`Día ${levelNumber} en pausa. ¡Tómate un respiro dulce!`}
        icon={<div className="text-3xl">⏸️</div>}
        maxWidth="sm"
        showCloseButton={false}
      >
        <div className="flex flex-col gap-3">
          {/* Continuar jugando */}
          <CandyButton
            variant="primary"
            size="lg"
            fullWidth
            icon={<Play className="w-5 h-5 fill-white ml-0.5" />}
            onClick={onResume}
          >
            Continuar Jugando
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

          {/* Ver recetas */}
          <CandyButton
            variant="secondary"
            size="md"
            fullWidth
            icon={<BookOpen className="w-4 h-4" />}
            onClick={onOpenRecipes}
          >
            Libro de Recetas
          </CandyButton>

          <div className="flex gap-2.5 mt-1">
            {/* Toggle sonido */}
            <CandyButton
              variant="neutral"
              size="md"
              fullWidth
              icon={isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
              onClick={onToggleMute}
            >
              {isMuted ? 'Activar Sonido' : 'Silenciar'}
            </CandyButton>

            {/* Salir al menú */}
            <CandyButton
              variant="neutral"
              size="md"
              fullWidth
              icon={<Home className="w-4 h-4" />}
              onClick={() => setShowConfirmHome(true)}
            >
              Menú
            </CandyButton>
          </div>
        </div>
      </CandyModal>

      {/* Modal de confirmación para salir al menú */}
      {showConfirmHome && (
        <CandyModal
          isOpen={showConfirmHome}
          onClose={() => setShowConfirmHome(false)}
          title="¿Salir al Menú Principal?"
          subtitle="Se perderá el progreso de los clientes atendidos en este día."
          icon={<AlertCircle className="w-8 h-8 text-amber-500" />}
          maxWidth="sm"
        >
          <div className="flex flex-col gap-2.5 mt-2">
            <CandyButton
              variant="danger"
              size="md"
              fullWidth
              onClick={() => {
                setShowConfirmHome(false);
                onReturnHome();
              }}
            >
              Sí, Salir al Menú
            </CandyButton>
            <CandyButton
              variant="neutral"
              size="md"
              fullWidth
              onClick={() => setShowConfirmHome(false)}
            >
              No, Seguir Jugando
            </CandyButton>
          </div>
        </CandyModal>
      )}
    </>
  );
};
