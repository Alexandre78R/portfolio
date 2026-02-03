import React, { ReactElement, ChangeEvent, FormEvent, useCallback } from "react";
import InputField from "@/components/InputField/InputField";
import ButtonCustom from "@/components/Button/Button";

/**
 * Props for SearchInput component
 */
interface SearchInputProps {
  readonly value: string;
  readonly onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  readonly onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  readonly placeholder?: string;
  readonly buttonLabel?: string;
  readonly id?: string;
}

/**
 * Reusable search input component
 * @description Combines InputField and ButtonCustom for search functionality
 */
const SearchInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  buttonLabel = "Search",
  id = "search-input",
}: SearchInputProps): ReactElement => {
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      onSubmit(e);
    },
    [onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <InputField
          id={id}
          type="text"
          label=""
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-label="Search"
        />
      </div>
      <div className="flex sm:items-end">
        <ButtonCustom
          type="submit"
          text={buttonLabel}
        />
      </div>
    </form>
  );
};

SearchInput.displayName = "SearchInput";

export default SearchInput;
