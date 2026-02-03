import React, { useState, ReactElement, useCallback, ChangeEvent, FormEvent } from "react";
import ButtonCustom from "@/components/Button/Button";
import SearchInput from "@/components/AdminLayout/components/Input/SearchInput";

/**
 * Type for language filter options
 */
type LanguageFilter = "fr" | "en" | null;

/**
 * Props for TranslationsFilter component
 */
interface TranslationsFilterProps {
  readonly onSearch: (term: string) => void;
  readonly onFilterChange: (lang: LanguageFilter) => void;
  readonly langFilter: LanguageFilter;
  readonly translations: Record<string, string>;
}

/**
 * Translations filter component with search and language filter
 * @description Provides UI for filtering and searching translations
 */
const TranslationsFilter = ({
  onSearch,
  onFilterChange,
  langFilter,
  translations,
}: TranslationsFilterProps): ReactElement => {
  const [searchInput, setSearchInput] = useState<string>("");

  /**
   * Handle search input change
   */
  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    setSearchInput(e.currentTarget.value);
    },
    []
  );

  /**
   * Handle search form submission
   */
  const handleSearchSubmit = useCallback((e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSearch(searchInput);
  }, [searchInput, onSearch]);

  /**
   * Handle language filter button click
   */
  const handleFilterClick = useCallback(
    (lang: LanguageFilter): void => {
      onFilterChange(lang);
    },
    [onFilterChange]
  );

  const searchPlaceholder: string = translations.messageAdminTranslationsSearchPlaceholder || "Rechercher...";
  const searchButtonLabel: string = translations.messageAdminTranslationsSearchButton || "Rechercher";
  const filterLabel: string = translations.messageAdminTranslationsFilterLanguage || "Filtrer par langue";
  const filterAllLabel: string = translations.messageAdminTranslationsFilterAll || "Toutes";
  const filterFRLabel: string = translations.messageAdminTranslationsFilterFR || "Français";
  const filterENLabel: string = translations.messageAdminTranslationsFilterEN || "English";

  return (
    <div
      className="rounded-lg shadow-md p-6 space-y-4"
      style={{
        backgroundColor: "var(--admin-color)",
        border: "1px solid var(--grey-color)",
        color: "var(--text-color)",
      }}
    >
      {/* Search Section */}
      <SearchInput
        id="search-translations"
        value={searchInput}
        onChange={handleSearchChange}
        onSubmit={handleSearchSubmit}
        placeholder={searchPlaceholder}
        buttonLabel={searchButtonLabel}
      />

      {/* Language Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--text-color)" }}
        >
          {filterLabel}
        </label>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleFilterClick(null)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all w-full sm:w-auto"
            style={
              langFilter === null
                ? {
                    backgroundColor: "var(--primary-color)",
                    color: "var(--textButton-color)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }
                : {
                    backgroundColor: "var(--footer-color)",
                    color: "var(--text-color)",
                    border: "1px solid var(--grey-color)",
                  }
            }
            aria-pressed={langFilter === null}
            title={filterAllLabel}
          >
            {filterAllLabel}
          </button>

          <button
            type="button"
            onClick={() => handleFilterClick("fr")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all w-full sm:w-auto"
            style={
              langFilter === "fr"
                ? {
                    backgroundColor: "var(--primary-color)",
                    color: "var(--textButton-color)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }
                : {
                    backgroundColor: "var(--footer-color)",
                    color: "var(--text-color)",
                    border: "1px solid var(--grey-color)",
                  }
            }
            aria-pressed={langFilter === "fr"}
            title={filterFRLabel}
          >
            {filterFRLabel}
          </button>

          <button
            type="button"
            onClick={() => handleFilterClick("en")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all w-full sm:w-auto"
            style={
              langFilter === "en"
                ? {
                    backgroundColor: "var(--primary-color)",
                    color: "var(--textButton-color)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }
                : {
                    backgroundColor: "var(--footer-color)",
                    color: "var(--text-color)",
                    border: "1px solid var(--grey-color)",
                  }
            }
            aria-pressed={langFilter === "en"}
            title={filterENLabel}
          >
            {filterENLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

TranslationsFilter.displayName = "TranslationsFilter";

export default TranslationsFilter;
