import { z } from "zod";

/**
 * Post 생성/수정 폼 데이터 검증 스키마
 *
 * Zod를 사용한 타입 안전한 검증 스키마입니다.
 * react-hook-form의 zodResolver와 함께 사용됩니다.
 */
export const postFormSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력하세요")
    .max(100, "제목은 100자 이하여야 합니다"),

  author: z
    .string()
    .min(1, "작성자를 입력하세요")
    .max(50, "작성자명은 50자 이하여야 합니다"),

  category: z.enum(["development", "design", "accessibility"]),

  content: z
    .string()
    .max(1000, "내용은 1000자 이하여야 합니다")
    .optional(),

  status: z.enum(["published", "draft", "archived"]),
});

/**
 * TypeScript 타입 추론
 * react-hook-form의 타입으로 사용됩니다
 */
export type PostFormData = z.infer<typeof postFormSchema>;
