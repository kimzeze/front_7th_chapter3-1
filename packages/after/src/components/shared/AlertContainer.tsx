import React from "react";
// import { Alert } from "../organisms/Alert";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
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
        <div className="mb-4">
          <Alert variant="success" onClose={onCloseSuccess}>
            <CheckCircle className="size-4" />
            <AlertTitle>성공</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      {showError && (
        <div className="mb-4">
          <Alert variant="destructive" onClose={onCloseError}>
            <XCircle className="size-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};
