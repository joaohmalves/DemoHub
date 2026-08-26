import { useState } from 'react';
import { Modal } from '../common/Modal';
import styles from './FlowViewer.module.css';

interface FlowViewerProps {
  image?: string;
  agentName: string;
}

export function FlowViewer({
  image,
  agentName,
}: FlowViewerProps) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  if (!image) {
    return (
      <div className={styles.empty}>
        <p>Diagrama de fluxo ainda não disponível para este agente.</p>
      </div>
    );
  }

  const openViewer = () => {
    setZoom(1);
    setOpen(true);
  };

  const closeViewer = () => {
    setOpen(false);
    setZoom(1);
  };

  const decreaseZoom = () => {
    setZoom((current) => Math.max(0.5, current - 0.25));
  };

  const increaseZoom = () => {
    setZoom((current) => Math.min(3, current + 0.25));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={openViewer}
        aria-label={`Ampliar fluxo do agente ${agentName}`}
      >
        <img
          src={image}
          alt={`Fluxo do agente ${agentName}`}
          className={styles.thumbnail}
        />

        <span className={styles.hint}>
          Clique para ampliar
        </span>
      </button>

      <Modal
        open={open}
        onClose={closeViewer}
        title={`Fluxo — ${agentName}`}
      >
        <div className={styles.zoomControls}>
          <button
            type="button"
            onClick={decreaseZoom}
            aria-label="Diminuir zoom"
          >
            −
          </button>

          <span>{Math.round(zoom * 100)}%</span>

          <button
            type="button"
            onClick={increaseZoom}
            aria-label="Aumentar zoom"
          >
            +
          </button>

          <button
            type="button"
            onClick={resetZoom}
          >
            Reset
          </button>
        </div>

        <div className={styles.panArea}>
          <div
            className={styles.imageWrapper}
            style={{
              width: `${zoom * 100}%`,
            }}
          >
            <img
              src={image}
              alt={`Fluxo do agente ${agentName}`}
              className={styles.zoomedImage}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}