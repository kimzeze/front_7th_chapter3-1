import React from "react";
import { useForm } from "react-hook-form";
import type { UserFormData } from "@/validators";

// ShadCN Components
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { NativeSelect, NativeSelectOption } from "../../ui/native-select";

interface UserFormFieldsProps {
  form: ReturnType<typeof useForm<UserFormData>>;
}

/**
 * User 생성/수정 폼 필드 컴포넌트
 *
 * react-hook-form과 Zod validation을 사용하여
 * 타입 안전하고 검증된 입력을 제공합니다.
 *
 * @param form - react-hook-form의 form 객체
 */
export const UserFormFields: React.FC<UserFormFieldsProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-2 grid gap-4">
      <div className="space-y-2">
        <Label required htmlFor="username">
          사용자명
        </Label>
        <Input
          id="username"
          placeholder="사용자명을 입력하세요"
          aria-invalid={!!errors.username}
          {...register("username")}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label required htmlFor="email">
          이메일
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="이메일을 입력하세요"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">역할</Label>
          <NativeSelect
            id="role"
            aria-invalid={!!errors.role}
            {...register("role")}
          >
            <NativeSelectOption value="user">사용자</NativeSelectOption>
            <NativeSelectOption value="moderator">운영자</NativeSelectOption>
            <NativeSelectOption value="admin">관리자</NativeSelectOption>
          </NativeSelect>
          {errors.role && (
            <p className="text-sm text-destructive">{errors.role.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">상태</Label>
          <NativeSelect
            id="status"
            aria-invalid={!!errors.status}
            {...register("status")}
          >
            <NativeSelectOption value="active">활성</NativeSelectOption>
            <NativeSelectOption value="inactive">비활성</NativeSelectOption>
            <NativeSelectOption value="suspended">정지</NativeSelectOption>
          </NativeSelect>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
