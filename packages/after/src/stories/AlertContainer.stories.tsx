import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertContainer } from "../components/shared/AlertContainer";

const meta = {
  title: "Shared/AlertContainer",
  component: AlertContainer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AlertContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessAlert: Story = {
  args: {
    showSuccess: true,
    showError: false,
    successMessage: "작업이 성공적으로 완료되었습니다.",
    errorMessage: "",
    onCloseSuccess: () => console.log("Success alert closed"),
    onCloseError: () => {},
  },
};

export const ErrorAlert: Story = {
  args: {
    showSuccess: false,
    showError: true,
    successMessage: "",
    errorMessage: "오류가 발생했습니다. 다시 시도해주세요.",
    onCloseSuccess: () => {},
    onCloseError: () => console.log("Error alert closed"),
  },
};

export const BothAlerts: Story = {
  args: {
    showSuccess: true,
    showError: true,
    successMessage: "일부 작업이 성공했습니다.",
    errorMessage: "일부 작업이 실패했습니다.",
    onCloseSuccess: () => console.log("Success alert closed"),
    onCloseError: () => console.log("Error alert closed"),
  },
};

export const NoAlerts: Story = {
  args: {
    showSuccess: false,
    showError: false,
    successMessage: "",
    errorMessage: "",
    onCloseSuccess: () => {},
    onCloseError: () => {},
  },
};

export const LongMessages: Story = {
  args: {
    showSuccess: true,
    showError: true,
    successMessage:
      "사용자 데이터가 성공적으로 업데이트되었습니다. 모든 변경사항이 데이터베이스에 저장되었으며, 관련 알림이 발송되었습니다.",
    errorMessage:
      "네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인한 후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의하세요.",
    onCloseSuccess: () => console.log("Success alert closed"),
    onCloseError: () => console.log("Error alert closed"),
  },
};
