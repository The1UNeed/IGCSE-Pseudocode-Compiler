export interface WorkspaceState {
  source: string;
  stdinText: string;
  virtualFiles: Record<string, string[]>;
}

const STORAGE_KEY = "igcse-pseudocode-workspace-v1";

export function loadWorkspaceState(): WorkspaceState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as WorkspaceState;
    if (
      typeof parsed.source === "string" &&
      typeof parsed.stdinText === "string" &&
      typeof parsed.virtualFiles === "object"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveWorkspaceState(state: WorkspaceState): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
