import React from "react";
import { BrainCircuit, Cpu, Wifi, WifiOff, X } from "lucide-react";

const statusConfig = {
  ready: {
    label: "Ready",
    pill: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    dot: "bg-emerald-400",
  },
  warming: {
    label: "Waking",
    pill: "bg-amber-500/15 text-amber-200 border-amber-400/30",
    dot: "bg-amber-300",
  },
  offline: {
    label: "Offline",
    pill: "bg-red-500/15 text-red-200 border-red-400/30",
    dot: "bg-red-400",
  },
  idle: {
    label: "Idle",
    pill: "bg-coffee-500/15 text-coffee-200 border-coffee-400/20",
    dot: "bg-coffee-300",
  },
};

const BackendStatusRow = ({ icon: Icon, title, description, state }) => {
  const config = statusConfig[state] || statusConfig.idle;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-coffee-700/60 bg-coffee-900/60 p-3">
      <div className="mt-0.5 rounded-lg border border-coffee-700 bg-coffee-800/80 p-2 text-coffee-100">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
          <div className="text-sm font-bold text-coffee-50">{title}</div>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${config.pill}`}>
            {config.label}
          </span>
        </div>
        <p className="mt-1 text-xs leading-snug text-coffee-300">{description}</p>
      </div>
    </div>
  );
};

const BackendStatusPopup = ({ mlState, rlState, onDismiss, onOpen }) => {
  const allReady = mlState === "ready" && rlState === "ready";

  if (!onOpen) {
    return (
      <div className="fixed bottom-5 left-5 z-50 w-[min(92vw,360px)] rounded-2xl border border-coffee-700/70 bg-coffee-950/92 p-4 shadow-2xl backdrop-blur">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-amber-400">
              {allReady ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              Server Status
            </div>
            <p className="mt-1 text-xs text-coffee-300">
              {allReady
                ? "ML and RL services are awake and ready."
                : "The app is waking the assistant services in the background."}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full border border-coffee-700 bg-coffee-900 p-1.5 text-coffee-300 transition-colors hover:text-coffee-50"
            aria-label="Close backend status"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <BackendStatusRow
            icon={Cpu}
            title="ML Advisor"
            description="Used for price suggestions and week-by-week guidance."
            state={mlState}
          />
          <BackendStatusRow
            icon={BrainCircuit}
            title="RL Agent"
            description="Used for the RL benchmark opponent and policy suggestions."
            state={rlState}
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed bottom-5 left-5 z-50 rounded-full border border-coffee-700/70 bg-coffee-950/92 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-coffee-100 shadow-xl backdrop-blur"
    >
      Server Status
    </button>
  );
};

export default BackendStatusPopup;
