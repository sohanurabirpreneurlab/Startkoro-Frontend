import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { ArrowLeft, FileSpreadsheet, Library, Search, Shield, Trash2, UploadCloud, UserCog, X } from "lucide-react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type AdminModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AdminSection = "upload" | "manual" | "library" | "users";

type ParsedKnowledgeRow = {
  title: string;
  question: string;
  answer: string;
};

type KnowledgeDocument = {
  id: number;
  title: string;
  source_type: string;
  original_question: string | null;
  original_answer: string | null;
  category?: string | null;
  status: "draft" | "ready" | "archived";
  created_at?: string;
};

type KnowledgeDocumentsApiResponse = {
  success: boolean;
  data: KnowledgeDocument[];
};

type KnowledgeUploadStartApiResponse = {
  success: boolean;
  message: string;
  data: {
    batchId: string;
  };
};

interface UploadProgressData {
  batchId: string;
  status: "processing" | "completed" | "failed";
  totalRows: number;
  processedRows: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  progressPercentage: number;
  errorMessage?: string | null;
}

type UploadProgressApiResponse = {
  success: boolean;
  data: UploadProgressData;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  role: "user" | "admin";
  created_at?: string;
  updated_at?: string;
};

type AdminUsersApiResponse = {
  success: boolean;
  data: AdminUser[];
};

type UpdateUserRoleApiResponse = {
  success: boolean;
  message: string;
  data: AdminUser;
};

const adminSectionMeta: Array<{
  id: AdminSection;
  icon: typeof UploadCloud;
}> = [
  {
    id: "upload",
    icon: UploadCloud,
  },
  {
    id: "manual",
    icon: Shield,
  },
  {
    id: "library",
    icon: Library,
  },
  {
    id: "users",
    icon: UserCog,
  },
];

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function getRowValue(row: Record<string, unknown>, keys: string[]): string {
  for (const [rawKey, rawValue] of Object.entries(row)) {
    if (keys.includes(normalizeHeader(rawKey))) {
      return String(rawValue ?? "").trim();
    }
  }

  return "";
}

function mapSheetRows(rows: Record<string, unknown>[]): ParsedKnowledgeRow[] {
  return rows
    .map((row) => {
      const question = getRowValue(row, ["question", "prompt", "query"]);
      const answer = getRowValue(row, ["answer", "response", "content"]);
      const title = getRowValue(row, ["title", "name", "topic"]) || question.slice(0, 80).trim();

      return {
        title,
        question,
        answer,
      };
    })
    .filter((row) => row.title && row.question && row.answer);
}

function formatDate(value: string | undefined, unknownDate: string): string {
  if (!value) {
    return unknownDate;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function AdminModal({ open, onOpenChange }: AdminModalProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("upload");
  const [isLibrarySidebarHidden, setIsLibrarySidebarHidden] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedKnowledgeRow[]>([]);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressLabel, setUploadProgressLabel] = useState<string | null>(null);
  const [uploadSummary, setUploadSummary] = useState<UploadProgressData | null>(null);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [manualForm, setManualForm] = useState({
    title: "",
    question: "",
    answer: "",
  });
  const uploadPollIntervalRef = useRef<number | null>(null);

  const previewRows = useMemo(() => parsedRows.slice(0, 5), [parsedRows]);
  const adminSections = useMemo(
    () =>
      adminSectionMeta.map((section) => ({
        ...section,
        label: t(`admin.sections.${section.id}.label`),
        description: t(`admin.sections.${section.id}.description`),
      })),
    [t],
  );
  const checklistItems = t("admin.checklistItems", { returnObjects: true }) as string[];

  function clearUploadPolling(): void {
    if (uploadPollIntervalRef.current !== null) {
      window.clearInterval(uploadPollIntervalRef.current);
      uploadPollIntervalRef.current = null;
    }
  }

  function resetUploadProgressState(): void {
    clearUploadPolling();
    setActiveBatchId(null);
    setUploadProgress(0);
    setUploadProgressLabel(null);
    setUploadSummary(null);
  }

  function clearSelectedFile(): void {
    setSelectedFile(null);
    setSelectedFileName("");
    setParsedRows([]);
    resetUploadProgressState();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleOpenChange(nextOpen: boolean): void {
    if (!nextOpen && isImporting) {
      return;
    }

    if (!nextOpen) {
      clearUploadPolling();
      clearSelectedFile();
      setFeedback(null);
      setErrorMessage(null);
    }

    onOpenChange(nextOpen);
  }

  function handleSectionSelect(section: AdminSection): void {
    setActiveSection(section);
    setIsLibrarySidebarHidden(section === "library");
  }

  function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const apiMessage = error.response?.data?.message;

      if (typeof apiMessage === "string" && apiMessage.trim()) {
        return apiMessage;
      }
    }

    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    return t("admin.fallbackError");
  }

  function showError(error: unknown): void {
    setErrorMessage(getErrorMessage(error));
  }

  async function pollUploadProgress(batchId: string): Promise<UploadProgressData> {
    return new Promise((resolve, reject) => {
      let requestInFlight = false;

      const fetchProgress = async () => {
        if (requestInFlight) {
          return;
        }

        requestInFlight = true;

        try {
          const response = await api.get<UploadProgressApiResponse>(
            `/admin/knowledge/upload/${batchId}/progress`,
          );
          const nextSummary = response.data.data;

          setUploadSummary(nextSummary);

          // File transfer and backend processing are different phases.
          // Axios reports only the browser-to-server upload, so polling fills in the remaining 80%.
          const totalProgress = Math.min(100, 20 + Math.round(nextSummary.progressPercentage * 0.8));

          setUploadProgress(totalProgress);
          setUploadProgressLabel(
            nextSummary.status === "processing"
              ? t("admin.processingRowsStatus", {
                  processed: nextSummary.processedRows,
                  total: nextSummary.totalRows,
                })
              : nextSummary.status === "completed"
                ? t("admin.completedStatus")
                : t("admin.failedStatus"),
          );

          if (nextSummary.status === "completed" || nextSummary.status === "failed") {
            clearUploadPolling();
            setActiveBatchId(null);
            resolve(nextSummary);
          }
        } catch (error) {
          clearUploadPolling();
          setActiveBatchId(null);
          reject(error);
        } finally {
          requestInFlight = false;
        }
      };

      void fetchProgress();

      // Polling keeps the MVP simple while the backend updates batch progress in Postgres.
      uploadPollIntervalRef.current = window.setInterval(() => {
        void fetchProgress();
      }, 1500);
    });
  }

  async function loadUsers(search?: string): Promise<void> {
    setIsLoadingUsers(true);

    try {
      const response = await api.get<AdminUsersApiResponse>("/admin/users", {
        params: search?.trim() ? { search: search.trim() } : undefined,
      });
      setUsers(response.data.data);
    } catch (error) {
      showError(error);
    } finally {
      setIsLoadingUsers(false);
    }
  }

  async function loadDocuments(): Promise<void> {
    setIsLoadingDocuments(true);

    try {
      const response = await api.get<KnowledgeDocumentsApiResponse>("/knowledge/documents");
      setDocuments(response.data.data);
    } catch (error) {
      showError(error);
    } finally {
      setIsLoadingDocuments(false);
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    if (activeSection === "library") {
      void loadDocuments();
    }

    if (activeSection === "users") {
      void loadUsers(userSearch);
    }
  }, [activeSection, open]);

  useEffect(() => {
    if (!open || activeSection !== "users") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadUsers(userSearch);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeSection, open, userSearch]);

  useEffect(() => {
    if (!open) {
      setFeedback(null);
      setErrorMessage(null);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      clearUploadPolling();
    };
  }, []);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFeedback(null);
    resetUploadProgressState();
    setSelectedFile(file);
    setSelectedFileName(file.name);
    setParsedRows([]);
    setIsParsingFile(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
        defval: "",
      });
      const nextRows = mapSheetRows(rows);

      setParsedRows(nextRows);
      setFeedback(
        nextRows.length > 0
          ? t("admin.parsedRows", { count: nextRows.length, file: file.name })
          : t("admin.noValidRows"),
      );
    } catch (error) {
      showError(error);
    } finally {
      setIsParsingFile(false);
      event.target.value = "";
    }
  }

  async function handleBulkImport() {
    if (!selectedFile || parsedRows.length === 0) {
      return;
    }

    clearUploadPolling();
    setIsImporting(true);
    setFeedback(null);
    setErrorMessage(null);
    setUploadSummary(null);
    setActiveBatchId(null);
    setUploadProgress(0);
    setUploadProgressLabel(t("admin.uploadingStatus"));

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post<KnowledgeUploadStartApiResponse>("/admin/knowledge/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) {
            return;
          }

          const nextUploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 20);
          setUploadProgress(nextUploadProgress);
          setUploadProgressLabel(t("admin.uploadingStatus"));
        },
      });
      const batchId = response.data.data.batchId;

      setActiveBatchId(batchId);
      setUploadProgress((previousValue) => Math.max(previousValue, 20));
      setUploadProgressLabel(
        t("admin.processingRowsStatus", {
          processed: 0,
          total: parsedRows.length,
        }),
      );

      const summary = await pollUploadProgress(batchId);
      const summaryLines = [
        t("admin.processedRows", { count: summary.processedRows }),
        t("admin.insertedRows", { count: summary.successCount }),
        t("admin.skippedRows", { count: summary.skippedCount }),
        t("admin.failedRows", { count: summary.failedCount }),
      ];

      if (summary.status === "completed") {
        setFeedback(summaryLines.join(" "));
        setSelectedFile(null);
        setSelectedFileName("");
        setParsedRows([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        await loadDocuments();
      } else {
        showError(summary.errorMessage || t("admin.uploadFailedMessage"));
      }
    } catch (error) {
      resetUploadProgressState();
      showError(error);
    } finally {
      setIsImporting(false);
    }
  }

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingManual(true);
    setFeedback(null);

    try {
      await api.post("/knowledge/manual-qa", {
        title: manualForm.title.trim(),
        question: manualForm.question.trim(),
        answer: manualForm.answer.trim(),
      });

      setManualForm({
        title: "",
        question: "",
        answer: "",
      });
      setFeedback(t("admin.knowledgeSaved"));
    } catch (error) {
      showError(error);
    } finally {
      setIsSavingManual(false);
    }
  }

  async function handleDeleteDocument(documentId: number) {
    setDeletingDocumentId(documentId);
    setFeedback(null);

    try {
      await api.delete(`/knowledge/documents/${documentId}`);
      setDocuments((prev) => prev.filter((document) => document.id !== documentId));
      setFeedback(t("admin.documentDeleted"));
    } catch (error) {
      showError(error);
    } finally {
      setDeletingDocumentId(null);
    }
  }

  async function handleUserRoleChange(userId: string, role: "user" | "admin") {
    setUpdatingUserId(userId);
    setFeedback(null);

    try {
      const response = await api.patch<UpdateUserRoleApiResponse>(`/admin/users/${userId}/role`, {
        role,
      });
      const updatedUser = response.data.data;

      setUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      );
      setFeedback(t("admin.roleUpdated", { name: updatedUser.name, role: updatedUser.role }));
    } catch (error) {
      showError(error);
    } finally {
      setUpdatingUserId(null);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="h-[90vh] max-h-[90vh] max-w-6xl overflow-hidden border-0 bg-card p-0 shadow-soft md:h-[780px] md:max-h-[90vh]">
          <div className={cn("grid h-full min-h-0 grid-cols-1", !isLibrarySidebarHidden && "md:grid-cols-[260px_minmax(0,1fr)]")}>
            {!isLibrarySidebarHidden ? (
            <aside className="min-h-0 overflow-auto border-b bg-slate-950 text-slate-50 md:h-full md:border-b-0 md:border-r md:border-slate-800">
            <div className="border-b border-slate-800 px-5 py-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                <Shield className="h-3.5 w-3.5" />
                {t("admin.console")}
              </div>
              <div className="mt-4 text-lg font-semibold">{t("admin.knowledgeOps")}</div>
              <p className="mt-1 text-sm text-slate-400">
                {t("admin.sidebarDescription")}
              </p>
            </div>

            <nav className="space-y-1 p-3">
              {adminSections.map((section) => {
                const Icon = section.icon;

                return (
                  <button
                    key={section.id}
                    type="button"
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                      activeSection === section.id
                        ? "border-slate-600 bg-slate-800 text-slate-50"
                        : "border-transparent bg-transparent text-slate-300 hover:border-slate-800 hover:bg-slate-900",
                    )}
                    onClick={() => handleSectionSelect(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">{section.label}</div>
                        <div className="mt-0.5 text-xs text-slate-400">{section.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>
            ) : null}

            <section className="flex min-h-0 h-full flex-col overflow-hidden bg-gradient-to-b from-background via-background to-accent/20">
            <DialogHeader className="border-b px-6 py-5">
              <DialogTitle className="text-xl">{t("admin.workspaceTitle")}</DialogTitle>
              <DialogDescription>
                {t("admin.workspaceDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 min-h-0 overflow-auto px-6 py-6">
              {feedback ? (
                <div className="mb-5 rounded-xl border bg-card/80 px-4 py-3 text-sm text-muted-foreground text-red-600">
                  {feedback}
                </div>
              ) : null}

              {activeSection === "upload" ? (
                <div className="space-y-6">
                  <div className="rounded-2xl border bg-card/80 p-5">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-accent p-3">
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold">{t("admin.bulkTitle")}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t("admin.bulkDescription")}
                        </p>
                        <Input
                          ref={fileInputRef}
                          className="mt-4"
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileChange}
                          disabled={isParsingFile || isImporting}
                        />
                        {selectedFileName ? (
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="min-w-0 break-all">{t("admin.selectedFile", { name: selectedFileName })}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={clearSelectedFile}
                              disabled={isParsingFile || isImporting}
                            >
                              <X className="h-4 w-4" />
                              {t("common.remove")}
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-3 text-sm text-muted-foreground">{t("admin.noFile")}</div>
                        )}
                        {uploadProgressLabel || uploadSummary ? (
                          <div className="mt-4 rounded-2xl border bg-background/70 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-medium">{uploadProgressLabel || t("admin.waitingStatus")}</div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {activeBatchId || uploadSummary?.batchId
                                    ? t("admin.batchIdLabel", { batchId: activeBatchId || uploadSummary?.batchId })
                                    : t("admin.progressReady")}
                                </div>
                              </div>
                              <div className="text-sm font-semibold">{uploadProgress}%</div>
                            </div>
                            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-[linear-gradient(135deg,_#10b981,_#14b8a6_45%,_#2563eb)] transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>

                            {uploadSummary ? (
                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border bg-card px-3 py-3 text-sm">
                                  <div className="text-muted-foreground">{t("admin.totalRowsLabel")}</div>
                                  <div className="mt-1 font-semibold">{uploadSummary.totalRows}</div>
                                </div>
                                <div className="rounded-xl border bg-card px-3 py-3 text-sm">
                                  <div className="text-muted-foreground">{t("admin.processedRowsLabel")}</div>
                                  <div className="mt-1 font-semibold">{uploadSummary.processedRows}</div>
                                </div>
                                <div className="rounded-xl border bg-card px-3 py-3 text-sm">
                                  <div className="text-muted-foreground">{t("admin.successCountLabel")}</div>
                                  <div className="mt-1 font-semibold">{uploadSummary.successCount}</div>
                                </div>
                                <div className="rounded-xl border bg-card px-3 py-3 text-sm">
                                  <div className="text-muted-foreground">{t("admin.skippedCountLabel")}</div>
                                  <div className="mt-1 font-semibold">{uploadSummary.skippedCount}</div>
                                </div>
                                <div className="rounded-xl border bg-card px-3 py-3 text-sm">
                                  <div className="text-muted-foreground">{t("admin.failedCountLabel")}</div>
                                  <div className="mt-1 font-semibold">{uploadSummary.failedCount}</div>
                                </div>
                                <div className="rounded-xl border bg-card px-3 py-3 text-sm">
                                  <div className="text-muted-foreground">{t("admin.backendProgressLabel")}</div>
                                  <div className="mt-1 font-semibold">{uploadSummary.progressPercentage}%</div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-h-0 rounded-2xl border bg-card/80 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="font-semibold">{t("admin.preview")}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t("admin.previewDescription")}
                          </p>
                        </div>
                        <Button onClick={handleBulkImport} disabled={parsedRows.length === 0 || isImporting || isParsingFile}>
                          {isImporting ? t("admin.uploadInProgress") : t("admin.importRows")}
                        </Button>
                      </div>

                      <div className="mt-4 max-h-[42vh] space-y-3 overflow-auto">
                        {previewRows.length === 0 ? (
                          <div className="rounded-xl border border-dashed bg-background/60 p-4 text-sm text-muted-foreground">
                            {isParsingFile
                              ? t("admin.readingSpreadsheet")
                              : t("admin.noParsedRows")}
                          </div>
                        ) : (
                          previewRows.map((row, index) => (
                            <div key={`${row.title}-${index}`} className="rounded-xl border bg-background/60 p-4">
                              <div className="text-sm font-semibold">{row.title}</div>
                              <div className="mt-2 text-sm text-muted-foreground">{row.question}</div>
                              <div className="mt-2 text-sm">{row.answer}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-card/80 p-5">
                      <h4 className="font-semibold">{t("admin.checklist")}</h4>
                      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                        {checklistItems.map((item) => (
                          <div key={item} className="rounded-xl border bg-background/60 p-3">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeSection === "manual" ? (
                <div className="max-w-3xl rounded-2xl border bg-card/80 p-5">
                  <h3 className="text-lg font-semibold">{t("admin.manualTitle")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("admin.manualDescription")}
                  </p>

                  <form className="mt-5 space-y-4" onSubmit={handleManualSubmit}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("admin.title")}</label>
                      <Input
                        value={manualForm.title}
                        onChange={(event) =>
                          setManualForm((prev) => ({
                            ...prev,
                            title: event.target.value,
                          }))
                        }
                        placeholder={t("admin.titlePlaceholder")}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("admin.question")}</label>
                      <Textarea
                        className="min-h-[120px]"
                        value={manualForm.question}
                        onChange={(event) =>
                          setManualForm((prev) => ({
                            ...prev,
                            question: event.target.value,
                          }))
                        }
                        placeholder={t("admin.questionPlaceholder")}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("admin.answer")}</label>
                      <Textarea
                        className="min-h-[180px]"
                        value={manualForm.answer}
                        onChange={(event) =>
                          setManualForm((prev) => ({
                            ...prev,
                            answer: event.target.value,
                          }))
                        }
                        placeholder={t("admin.answerPlaceholder")}
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSavingManual}>
                        {isSavingManual ? t("common.saving") : t("admin.saveKnowledge")}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : null}

              {activeSection === "library" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Button
                        type="button"
                        variant="ghost"
                        className="mb-3 -ml-3 h-9 px-3"
                        onClick={() => setIsLibrarySidebarHidden(false)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        {t("admin.backToSidebar")}
                      </Button>
                      <h3 className="text-lg font-semibold">{t("admin.libraryTitle")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("admin.libraryDescription")}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => void loadDocuments()} disabled={isLoadingDocuments}>
                      {isLoadingDocuments ? t("common.refreshing") : t("admin.refresh")}
                    </Button>
                  </div>

                  <div className="overflow-hidden rounded-2xl border bg-card/80">
                    {documents.length === 0 && !isLoadingDocuments ? (
                      <div className="p-5 text-sm text-muted-foreground">
                        {t("admin.noDocuments")}
                      </div>
                    ) : null}

                    {documents.length > 0 ? (
                      <div className="overflow-auto">
                        <table className="min-w-[980px] w-full text-left text-sm">
                          <thead className="bg-slate-50 text-slate-600">
                            <tr className="border-b">
                              <th className="px-4 py-3 font-medium">{t("admin.title")}</th>
                              <th className="px-4 py-3 font-medium">{t("admin.question")}</th>
                              <th className="px-4 py-3 font-medium">{t("admin.answer")}</th>
                              <th className="px-4 py-3 font-medium">{t("admin.categoryLabel")}</th>
                              <th className="px-4 py-3 font-medium">{t("admin.uploadedTimeLabel")}</th>
                              <th className="px-4 py-3 font-medium">{t("admin.actionsLabel")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {documents.map((document) => (
                              <tr key={document.id} className="border-b align-top last:border-b-0">
                                <td className="px-4 py-4">
                                  <div className="min-w-[180px] font-semibold text-slate-900">{document.title}</div>
                                  <div className="mt-1 text-xs text-muted-foreground">
                                    #{document.id} • {document.source_type} • {document.status}
                                  </div>
                                </td>
                                <td className="max-w-[260px] px-4 py-4 text-slate-700">
                                  <div className="line-clamp-4 whitespace-pre-wrap">{document.original_question || "—"}</div>
                                </td>
                                <td className="max-w-[320px] px-4 py-4 text-slate-700">
                                  <div className="line-clamp-4 whitespace-pre-wrap">{document.original_answer || "—"}</div>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="inline-flex rounded-full border bg-background px-2.5 py-1 text-xs text-slate-700">
                                    {document.category?.trim() || t("admin.noCategory")}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-slate-600">
                                  {formatDate(document.created_at, t("common.unknownDate"))}
                                </td>
                                <td className="px-4 py-4">
                                  <Button
                                    variant="destructive"
                                    onClick={() => void handleDeleteDocument(document.id)}
                                    disabled={deletingDocumentId === document.id}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    {deletingDocumentId === document.id ? t("common.deleting") : t("common.delete")}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {activeSection === "users" ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border bg-card/80 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{t("admin.userTitle")}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t("admin.userDescription")}
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => void loadUsers(userSearch)} disabled={isLoadingUsers}>
                        {isLoadingUsers ? t("common.refreshing") : t("admin.refresh")}
                      </Button>
                    </div>

                    <div className="mt-4 relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        value={userSearch}
                        onChange={(event) => setUserSearch(event.target.value)}
                        placeholder={t("admin.searchPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {!isLoadingUsers && users.length === 0 ? (
                      <div className="rounded-2xl border bg-card/80 p-5 text-sm text-muted-foreground">
                        {t("admin.noUsers")}
                      </div>
                    ) : null}

                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col gap-4 rounded-2xl border bg-card/80 p-5 xl:flex-row xl:items-center xl:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="text-base font-semibold">{user.name}</div>
                          <div className="mt-1 text-sm text-muted-foreground">{user.email}</div>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span className="rounded-full border bg-background/70 px-2.5 py-1">
                              {user.role}
                            </span>
                            <span className="rounded-full border bg-background/70 px-2.5 py-1">
                              {user.mobile_number || t("admin.noMobile")}
                            </span>
                            <span className="rounded-full border bg-background/70 px-2.5 py-1">
                              {t("common.updated", { date: formatDate(user.updated_at, t("common.unknownDate")) })}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={user.role === "user" ? "default" : "outline"}
                            onClick={() => void handleUserRoleChange(user.id, "user")}
                            disabled={updatingUserId === user.id || user.role === "user"}
                          >
                            {updatingUserId === user.id && user.role !== "user" ? t("admin.updating") : t("admin.makeUser")}
                          </Button>
                          <Button
                            variant={user.role === "admin" ? "default" : "outline"}
                            onClick={() => void handleUserRoleChange(user.id, "admin")}
                            disabled={updatingUserId === user.id || user.role === "admin"}
                          >
                            {updatingUserId === user.id && user.role !== "admin" ? t("admin.updating") : t("admin.makeAdmin")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(errorMessage)} onOpenChange={(nextOpen) => !nextOpen && setErrorMessage(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("common.error")}</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setErrorMessage(null)}>
              {t("common.close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
