import React from "react";
import { UseFormReturn } from "react-hook-form";
import type { PostFormData } from "../../../validators/postSchema";

// ShadCN Components
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { NativeSelect, NativeSelectOption } from "../../ui/native-select";
import { Textarea } from "../../ui/textarea";

interface PostFormFieldsProps {
  form: UseFormReturn<PostFormData>;
}

/**
 * Post 생성/수정 폼 필드 컴포넌트
 *
 * react-hook-form과 Zod validation을 사용하여
 * 타입 안전하고 검증된 입력을 제공합니다.
 *
 * @param form - react-hook-form의 form 객체
 */
export const PostFormFields: React.FC<PostFormFieldsProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-2 grid gap-4">
      <div className="space-y-2">
        <Label required htmlFor="title">
          제목
        </Label>
        <Input
          id="title"
          placeholder="게시글 제목을 입력하세요"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label required htmlFor="author">
            작성자
          </Label>
          <Input
            id="author"
            placeholder="작성자명"
            aria-invalid={!!errors.author}
            {...register("author")}
          />
          {errors.author && (
            <p className="text-sm text-destructive">{errors.author.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">카테고리</Label>
          <NativeSelect
            id="category"
            aria-invalid={!!errors.category}
            {...register("category")}
          >
            <NativeSelectOption value="" disabled>
              카테고리 선택
            </NativeSelectOption>
            <NativeSelectOption value="development">
              Development
            </NativeSelectOption>
            <NativeSelectOption value="design">Design</NativeSelectOption>
            <NativeSelectOption value="accessibility">
              Accessibility
            </NativeSelectOption>
          </NativeSelect>
          {errors.category && (
            <p className="text-sm text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          placeholder="게시글 내용을 입력하세요"
          rows={6}
          aria-invalid={!!errors.content}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>
    </div>
  );
};
