import React from 'react';
import { Alert } from '../organisms/Alert';

interface AlertContainerProps {
  showSuccess: boolean;
  showError: boolean;
  successMessage: string;
  errorMessage: string;
  onCloseSuccess: () => void;
  onCloseError: () => void;
}

export const AlertContainer: React.FC<AlertContainerProps> = ({
  showSuccess,
  showError,
  successMessage,
  errorMessage,
  onCloseSuccess,
  onCloseError,
}) => {
  if (!showSuccess && !showError) return null;

  return (
    <>
      {showSuccess && (
        <div style={{ marginBottom: "10px" }}>
          <Alert
            variant="success"
            title="성공"
            onClose={onCloseSuccess}
          >
            {successMessage}
          </Alert>
        </div>
      )}

      {showError && (
        <div style={{ marginBottom: "10px" }}>
          <Alert
            variant="error"
            title="오류"
            onClose={onCloseError}
          >
            {errorMessage}
          </Alert>
        </div>
      )}
    </>
  );
};
