import React from "react";

import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { NativeSelect, NativeSelectOption } from "../../ui/native-select";
import { Textarea } from "../../ui/textarea";

interface PostFormFieldsProps {
  formData: {
    title?: string;
    author?: string;
    category?: string;
    content?: string;
  };
  onChange: (formData: any) => void;
}

export const PostFormFields: React.FC<PostFormFieldsProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-2 grid gap-4">
      <div className="space-y-2">
        <Label required htmlFor="title">
          제목
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          placeholder="게시글 제목을 입력하세요"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label required htmlFor="author">
            작성자
          </Label>
          <Input
            id="author"
            name="author"
            value={formData.author || ""}
            onChange={(e) => onChange({ ...formData, author: e.target.value })}
            placeholder="작성자명"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">카테고리</Label>

          <NativeSelect
            id="category"
            name="category"
            value={formData.category || ""}
            onChange={(e) =>
              onChange({ ...formData, category: e.target.value })
            }
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
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content || ""}
          onChange={(e) => onChange({ ...formData, content: e.target.value })}
          placeholder="게시글 내용을 입력하세요"
          rows={6}
        />
      </div>
    </div>
  );
};
