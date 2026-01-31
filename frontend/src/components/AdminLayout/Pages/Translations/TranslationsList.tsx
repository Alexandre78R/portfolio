import React, { useState, ReactElement, useCallback } from "react";
import { ApolloError } from "@apollo/client";
import AdminLayout from "@/components/AdminLayout/AdminLayout";
import TextAdmin from "@/components/AdminLayout/components/Text/TextAdmin";
import ButtonCustom from "@/components/Button/Button";
import { useLang, LangContextType } from "@/context/Lang/LangContext";
import { useListTranslationsPaginated, useUpsertTranslation } from "@/utils/hooks/useTranslation";
import TranslationsTable from "@/components/AdminLayout/components/Translations/TranslationsTable";
import TranslationsFilter from "@/components/AdminLayout/components/Translations/TranslationsFilter";
import TranslationsEditModal from "@/components/AdminLayout/components/Translations/TranslationsEditModal";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import type {
  ListTranslationsPaginatedQuery,
  UpsertTranslationMutation,
} from "@/types/graphql";

type LanguageFilter = "fr" | "en" | null;

interface TranslationItemDTO {
  readonly key: string;
  readonly value: string;
}

interface EditModalState {
  readonly isOpen: boolean;
  readonly selectedTranslation: TranslationItemDTO | null;
}

interface TranslationsListPageState {
  readonly page: number;
  readonly limit: number;
  readonly searchTerm: string | null;
  readonly langFilter: LanguageFilter;
  readonly editModal: EditModalState;
}

const TranslationsListPage = (): ReactElement => {
  const contextLang: LangContextType = useLang();
  const contextTranslations: Record<string, string> = contextLang.translations as Record<string, string>;

  const [pageState, setPageState] = useState<TranslationsListPageState>({
    page: 1,
    limit: 10,
    searchTerm: null,
    langFilter: null,
    editModal: {
      isOpen: false,
      selectedTranslation: null,
    },
  });

  const { data: translationsData, loading: isLoadingTranslations, error: loadError, refetch } = useListTranslationsPaginated(
    pageState.page,
    pageState.limit,
    pageState.langFilter,
    pageState.searchTerm
  );

  const { upsertTranslation, loading: isUpserting, error: upsertError } = useUpsertTranslation();

  const translationsResponse = translationsData?.listTranslationsPaginated;
  const translations: TranslationItemDTO[] | undefined = translationsResponse?.translations ?? undefined;

  /**
   * Handle translation edit button click
   */
  const handleEdit: (translation: TranslationItemDTO) => void = useCallback((translation: TranslationItemDTO): void => {
    setPageState((prevState: TranslationsListPageState) => ({
      ...prevState,
      editModal: {
        isOpen: true,
        selectedTranslation: translation,
      },
    }));
  }, []);

  /**
   * Handle save translation changes
   */
  const handleSave: (value: string) => Promise<void> = useCallback(
    async (value: string): Promise<void> => {
      const selectedTranslation: TranslationItemDTO | null = pageState.editModal.selectedTranslation;

      if (!selectedTranslation) {
        throw new Error("No translation selected for editing");
      }

      try {
        await upsertTranslation(selectedTranslation.key, value, pageState.langFilter || "fr");
        
        setPageState((prevState: TranslationsListPageState) => ({
          ...prevState,
          editModal: {
            isOpen: false,
            selectedTranslation: null,
          },
        }));

        await refetch();
      } catch (error: unknown) {
        console.error("Error saving translation:", error);
        throw error;
      }
    },
    [pageState.editModal.selectedTranslation, pageState.langFilter, upsertTranslation, refetch]
  );

  /**
   * Handle search input change
   */
  const handleSearch: (term: string) => void = useCallback((term: string): void => {
    setPageState((prevState: TranslationsListPageState) => ({
      ...prevState,
      searchTerm: term || null,
      page: 1,
    }));
  }, []);

  /**
   * Handle language filter change
   */
  const handleFilterChange: (lang: LanguageFilter) => void = useCallback((lang: LanguageFilter): void => {
    setPageState((prevState: TranslationsListPageState) => ({
      ...prevState,
      langFilter: lang,
      page: 1,
    }));
  }, []);

  /**
   * Handle page navigation
   */
  const handlePageChange: (newPage: number) => void = useCallback((newPage: number): void => {
    setPageState((prevState: TranslationsListPageState) => ({
      ...prevState,
      page: newPage,
    }));
  }, []);

  /**
   * Handle modal close
   */
  const handleCloseModal: () => void = useCallback((): void => {
    setPageState((prevState: TranslationsListPageState) => ({
      ...prevState,
      editModal: {
        isOpen: false,
        selectedTranslation: null,
      },
    }));
  }, []);

  if (isLoadingTranslations && !translations) {
    return (
      <AdminLayout>
        <LoadingCustom />
      </AdminLayout>
    );
  }

  const totalItems: number = translationsResponse?.total ?? 0;
  const totalPages: number = totalItems > 0 ? Math.ceil(totalItems / pageState.limit) : 1;
  const isPreviousDisabled: boolean = pageState.page === 1;
  const isNextDisabled: boolean = totalItems === 0 || pageState.page >= totalPages;
  const titleText: string = contextTranslations.messageAdminTranslationsTitle || "Gestion des traductions";
  const descriptionText: string = contextTranslations.messageAdminTranslationsDescription || "Gérez les traductions de votre portfolio";
  const errorText: string = contextTranslations.messageAdminTranslationsError || "Erreur lors du chargement";
  const notFoundText: string = contextTranslations.messageAdminTranslationsListNotFound || "Aucune traduction trouvée";
  const previousButtonText: string = contextTranslations.messageAdminTranslationsPaginationPrevious || "Précédent";
  const nextButtonText: string = contextTranslations.messageAdminTranslationsPaginationNext || "Suivant";
  const pageOfText: string = contextTranslations.messageAdminTranslationsPaginationOf || "de";

  return (
    // <AdminLayout>
      <div className="w-full h-full p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <TextAdmin type="h1">{titleText}</TextAdmin>
          <TextAdmin type="p" className="text-gray-500">
            {descriptionText}
          </TextAdmin>
        </div>

        {/* Filter Section */}
        <TranslationsFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          langFilter={pageState.langFilter}
          translations={contextTranslations}
        />

        {/* Error Alert */}
        {loadError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errorText}
          </div>
        )}

        {/* Loading State */}
        {isLoadingTranslations && <LoadingCustom />}

        {/* Table Section */}
        {translations && translations.length > 0 ? (
          <div className="space-y-4">
            <TranslationsTable
              translations={translations}
              onEdit={handleEdit}
              translations_context={contextTranslations}
            />

            {/* Pagination Section */}
            <div className="flex justify-between items-center pt-4">
              <ButtonCustom
                onClick={() => handlePageChange(pageState.page - 1)}
                disable={isPreviousDisabled}
                text={previousButtonText}
                type="button"
              />

              <TextAdmin type="span" className="text-sm font-medium">
                {pageState.page} {pageOfText} {totalPages}
              </TextAdmin>

              <ButtonCustom
                onClick={() => handlePageChange(pageState.page + 1)}
                disable={isNextDisabled}
                text={nextButtonText}
                type="button"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <TextAdmin type="p" className="text-gray-500">
              {notFoundText}
            </TextAdmin>
          </div>
        )}

        {/* Edit Modal */}
        {pageState.editModal.isOpen && pageState.editModal.selectedTranslation && (
          <TranslationsEditModal
            translation={pageState.editModal.selectedTranslation}
            isOpen={pageState.editModal.isOpen}
            onClose={handleCloseModal}
            onSave={handleSave}
            isLoading={isUpserting}
            error={upsertError}
            translations={contextTranslations}
          />
        )}
      </div>
    // </AdminLayout>
  );
};

TranslationsListPage.displayName = "TranslationsListPage";

export default TranslationsListPage;
