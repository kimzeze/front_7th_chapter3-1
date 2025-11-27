import { useState } from "react";

/**
 * 알림 상태를 관리하는 커스텀 훅
 *
 * 성공 메시지와 에러 메시지를 독립적으로 관리하며,
 * 각각의 표시/숨김 상태와 메시지 내용을 제어합니다.
 *
 * @returns {Object} 알림 상태 및 제어 함수
 * @returns {boolean} showSuccessAlert - 성공 알림 표시 여부
 * @returns {string} alertMessage - 성공 메시지 내용
 * @returns {boolean} showErrorAlert - 에러 알림 표시 여부
 * @returns {string} errorMessage - 에러 메시지 내용
 * @returns {Function} showSuccess - 성공 알림을 표시하는 함수
 * @returns {Function} showError - 에러 알림을 표시하는 함수
 * @returns {Function} closeSuccess - 성공 알림을 닫는 함수
 * @returns {Function} closeError - 에러 알림을 닫는 함수
 *
 * @example
 * const { showSuccess, showError, closeSuccess } = useAlertState();
 *
 * // 성공 메시지 표시
 * showSuccess("저장되었습니다");
 *
 * // 에러 메시지 표시
 * showError("저장에 실패했습니다");
 *
 * // 알림 닫기
 * closeSuccess();
 */
export const useAlertState = () => {
  // 성공 알림 상태
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 에러 알림 상태
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * 성공 알림을 표시합니다
   * @param {string} message - 표시할 성공 메시지
   */
  const showSuccess = (message: string) => {
    setAlertMessage(message);
    setShowSuccessAlert(true);
  };

  /**
   * 에러 알림을 표시합니다
   * @param {string} message - 표시할 에러 메시지
   */
  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorAlert(true);
  };

  /**
   * 성공 알림을 닫습니다
   */
  const closeSuccess = () => setShowSuccessAlert(false);

  /**
   * 에러 알림을 닫습니다
   */
  const closeError = () => setShowErrorAlert(false);

  return {
    // 성공 알림 관련
    showSuccessAlert,
    alertMessage,
    // 에러 알림 관련
    showErrorAlert,
    errorMessage,
    // 알림 제어 함수
    showSuccess,
    showError,
    closeSuccess,
    closeError,
  };
};
