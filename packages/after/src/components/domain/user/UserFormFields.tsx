import React from 'react';
import { FormInput, FormSelect } from '../../molecules';

interface UserFormFieldsProps {
  formData: {
    username?: string;
    email?: string;
    role?: string;
    status?: string;
  };
  onChange: (formData: any) => void;
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({ formData, onChange }) => {
  return (
    <>
      <FormInput
        name="username"
        value={formData.username || ""}
        onChange={(value) => onChange({ ...formData, username: value })}
        label="사용자명"
        placeholder="사용자명을 입력하세요"
        required
        width="full"
        fieldType="username"
      />
      <FormInput
        name="email"
        value={formData.email || ""}
        onChange={(value) => onChange({ ...formData, email: value })}
        label="이메일"
        placeholder="이메일을 입력하세요"
        type="email"
        required
        width="full"
        fieldType="email"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <FormSelect
          name="role"
          value={formData.role || "user"}
          onChange={(value) => onChange({ ...formData, role: value })}
          options={[
            { value: "user", label: "사용자" },
            { value: "moderator", label: "운영자" },
            { value: "admin", label: "관리자" },
          ]}
          label="역할"
          size="md"
        />
        <FormSelect
          name="status"
          value={formData.status || "active"}
          onChange={(value) => onChange({ ...formData, status: value })}
          options={[
            { value: "active", label: "활성" },
            { value: "inactive", label: "비활성" },
            { value: "suspended", label: "정지" },
          ]}
          label="상태"
          size="md"
        />
      </div>
    </>
  );
};
