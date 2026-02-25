"use client";

import { useMemo, useState } from "react";

interface VirtualFilesPanelProps {
  files: Record<string, string[]>;
  onChange: (nextFiles: Record<string, string[]>) => void;
}

export function VirtualFilesPanel({ files, onChange }: VirtualFilesPanelProps) {
  const fileNames = useMemo(() => Object.keys(files).sort(), [files]);
  const [selected, setSelected] = useState<string>(fileNames[0] ?? "");
  const activeSelected = selected && files[selected] ? selected : (fileNames[0] ?? "");
  const selectedContent = activeSelected ? (files[activeSelected] ?? []).join("\n") : "";

  const handleAddFile = () => {
    const proposed = window.prompt("Enter virtual file name", "FileA.txt");
    if (!proposed) {
      return;
    }
    const trimmed = proposed.trim();
    if (!trimmed) {
      return;
    }
    if (files[trimmed]) {
      window.alert("File already exists.");
      return;
    }
    onChange({ ...files, [trimmed]: [] });
    setSelected(trimmed);
  };

  const handleDeleteFile = () => {
    if (!activeSelected) {
      return;
    }
    const next = { ...files };
    delete next[activeSelected];
    onChange(next);
    const remaining = Object.keys(next).sort();
    setSelected(remaining[0] ?? "");
  };

  const handleContentChange = (value: string) => {
    if (!activeSelected) {
      return;
    }
    onChange({
      ...files,
      [activeSelected]: value.split("\n"),
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="ui-button" onClick={handleAddFile}>
          Add File
        </button>
        <button type="button" className="ui-button" onClick={handleDeleteFile} disabled={!selected}>
          Delete File
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr]">
        <div className="rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] p-2">
          {fileNames.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No virtual files.</p>
          ) : (
            <ul className="space-y-1">
              {fileNames.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    className={`w-full rounded px-2 py-1 text-left text-sm transition ${
                      activeSelected === name
                        ? "bg-[var(--accent)] text-black"
                        : "bg-transparent text-[var(--text)] hover:bg-[var(--panel-border)]"
                    }`}
                    onClick={() => setSelected(name)}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <textarea
          value={selectedContent}
          onChange={(event) => handleContentChange(event.target.value)}
          className="h-32 w-full rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] p-3 font-mono text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          placeholder={selected ? "One line per record" : "Create a virtual file to edit contents."}
          disabled={!selected}
        />
      </div>
    </div>
  );
}
