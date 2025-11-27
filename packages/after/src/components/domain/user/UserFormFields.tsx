import React from "react";

// ShadCN Components
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { NativeSelect, NativeSelectOption } from "../../ui/native-select";

interface UserFormFieldsProps {
  formData: {
    username?: string;
    email?: string;
    role?: string;
    status?: string;
  };
  onChange: (formData: any) => void;
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-2 grid gap-4">
      <div className="space-y-2">
        <Label required htmlFor="username">
          사용자명
        </Label>
        <Input
          id="username"
          name="username"
          value={formData.username || ""}
          onChange={(e) => onChange({ ...formData, username: e.target.value })}
          placeholder="사용자명을 입력하세요"
          required
        />
      </div>
      <div className="space-y-2">
        <Label required htmlFor="email">
          이메일
        </Label>
        <Input
          id="email"
          name="email"
          value={formData.email || ""}
          onChange={(e) => onChange({ ...formData, email: e.target.value })}
          placeholder="이메일을 입력하세요"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">역할</Label>
          <NativeSelect
            id="role"
            name="role"
            value={formData.role || "user"}
            onChange={(e) => onChange({ ...formData, role: e.target.value })}
            required
          >
            <NativeSelectOption value="user">사용자</NativeSelectOption>
            <NativeSelectOption value="moderator">운영자</NativeSelectOption>
            <NativeSelectOption value="admin">관리자</NativeSelectOption>
          </NativeSelect>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">상태</Label>
          <NativeSelect
            id="status"
            name="status"
            value={formData.status || "active"}
            onChange={(e) => onChange({ ...formData, status: e.target.value })}
            required
          >
            <NativeSelectOption value="active">활성</NativeSelectOption>
            <NativeSelectOption value="inactive">비활성</NativeSelectOption>
            <NativeSelectOption value="suspended">정지</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>
    </div>
  );
};
