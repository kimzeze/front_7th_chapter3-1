import { z } from "zod";

/**
 * User 생성/수정 폼 데이터 검증 스키마
 *
 * Zod를 사용한 타입 안전한 검증 스키마입니다.
 * react-hook-form의 zodResolver와 함께 사용됩니다.
 */
export const userFormSchema = z.object({
  username: z
    .string()
    .min(3, "사용자명은 3자 이상이어야 합니다")
    .max(20, "사용자명은 20자 이하여야 합니다")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다"
    ),

  email: z
    .string()
    .min(1, "이메일을 입력하세요")
    .email("유효한 이메일 주소를 입력하세요"),

  role: z.enum(["user", "moderator", "admin"]),

  status: z.enum(["active", "inactive", "suspended"]),
});

/**
 * TypeScript 타입 추론
 * react-hook-form의 타입으로 사용됩니다
 */
export type UserFormData = z.infer<typeof userFormSchema>;
