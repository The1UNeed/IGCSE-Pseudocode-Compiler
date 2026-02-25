"use client";

import { Diagnostic } from "@/compiler/types";

interface DiagnosticsPanelProps {
  diagnostics: Diagnostic[];
}

export function DiagnosticsPanel({ diagnostics }: DiagnosticsPanelProps) {
  if (diagnostics.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No diagnostics.</p>;
  }

  return (
    <div className="space-y-2">
      {diagnostics.map((diagnostic, index) => (
        <div
          key={`${diagnostic.code}-${diagnostic.line}-${diagnostic.column}-${index}`}
          className="rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] p-2"
        >
          <p className="font-mono text-xs text-[var(--accent)]">
            {diagnostic.code} · {diagnostic.severity.toUpperCase()} · L{diagnostic.line}:C
            {diagnostic.column}
          </p>
          <p className="mt-1 text-sm text-[var(--text)]">{diagnostic.message}</p>
          {diagnostic.hint ? <p className="mt-1 text-xs text-[var(--muted)]">Hint: {diagnostic.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}
