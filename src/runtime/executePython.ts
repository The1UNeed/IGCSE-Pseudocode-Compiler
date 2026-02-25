import { RunRequest, RunResult } from "@/compiler/types";

interface PendingRequest {
  resolve: (result: RunResult) => void;
  reject: (error: Error) => void;
}

interface WorkerResponse {
  id: number;
  result: RunResult;
}

class PythonRunner {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, PendingRequest>();

  private ensureWorker(): Worker {
    if (this.worker) {
      return this.worker;
    }

    this.worker = new Worker(new URL("../workers/pythonRunner.worker.ts", import.meta.url));

    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, result } = event.data;
      const pending = this.pending.get(id);
      if (!pending) {
        return;
      }
      this.pending.delete(id);
      pending.resolve(result);
    };

    this.worker.onerror = (event) => {
      const error = new Error(event.message || "Python worker crashed.");
      for (const pending of this.pending.values()) {
        pending.reject(error);
      }
      this.pending.clear();
      this.resetWorker();
    };

    return this.worker;
  }

  private resetWorker() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  async run(request: RunRequest, timeoutMs = 12000): Promise<RunResult> {
    const worker = this.ensureWorker();
    const id = this.nextId;
    this.nextId += 1;

    const workerPromise = new Promise<RunResult>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      worker.postMessage({ id, request });
    });

    const timeoutPromise = new Promise<RunResult>((resolve) => {
      const timer = window.setTimeout(() => {
        this.pending.delete(id);
        this.resetWorker();
        resolve({
          success: false,
          stdout: "",
          stderr: "Execution timed out.",
          diagnostics: [
            {
              code: "RUN408",
              message: `Execution exceeded ${timeoutMs / 1000} seconds and was stopped.`,
              severity: "error",
              line: 1,
              column: 1,
              endLine: 1,
              endColumn: 1,
              hint: "Check for infinite loops or large computations.",
            },
          ],
          virtualFiles: request.virtualFiles,
        });
      }, timeoutMs);

      workerPromise.finally(() => {
        window.clearTimeout(timer);
      });
    });

    try {
      return await Promise.race([workerPromise, timeoutPromise]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown runtime error";
      return {
        success: false,
        stdout: "",
        stderr: message,
        diagnostics: [
          {
            code: "RUN500",
            message,
            severity: "error",
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 1,
          },
        ],
        virtualFiles: request.virtualFiles,
      };
    }
  }
}

export const pythonRunner = new PythonRunner();
