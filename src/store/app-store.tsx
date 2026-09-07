import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as seed from "@/data/mock";
import type {
  Announcement,
  AppNotification,
  Building,
  Charge,
  Expense,
  Manager,
  Payment,
  PlatformUser,
  Poll,
  Provider,
  Resident,
  Review,
  Role,
  ServiceRequest,
  Settlement,
  Subscription,
  Suggestion,
  Unit,
  WorkSlot,
} from "@/data/types";
import { uid } from "@/lib/format";

export interface AppState {
  role: Role | null;
  buildings: Building[];
  managers: Manager[];
  users: PlatformUser[];
  subscriptions: Subscription[];
  units: Unit[];
  residents: Resident[];
  charges: Charge[];
  payments: Payment[];
  expenses: Expense[];
  requests: ServiceRequest[];
  providers: Provider[];
  announcements: Announcement[];
  polls: Poll[];
  suggestions: Suggestion[];
  notifications: AppNotification[];
  settlements: Settlement[];
  reviews: Review[];
  workSlots: WorkSlot[];
}

const initialState: AppState = {
  role: null,
  buildings: seed.buildings,
  managers: seed.managers,
  users: seed.platformUsers,
  subscriptions: seed.subscriptions,
  units: seed.units,
  residents: seed.residents,
  charges: seed.charges,
  payments: seed.payments,
  expenses: seed.expenses,
  requests: seed.serviceRequests,
  providers: seed.providers,
  announcements: seed.announcements,
  polls: seed.polls,
  suggestions: seed.suggestions,
  notifications: seed.notifications,
  settlements: seed.settlements,
  reviews: seed.reviews,
  workSlots: seed.workSlots,
};

const STORAGE_KEY = "bms-state-v1";

interface Store {
  state: AppState;
  hydrated: boolean;
  setRole: (role: Role | null) => void;
  update: <K extends keyof AppState>(key: K, value: AppState[K]) => void;
  reset: () => void;
}

const AppStoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupted local data */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const update = useCallback(<K extends keyof AppState>(key: K, value: AppState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setRole = useCallback((role: Role | null) => {
    setState((prev) => ({ ...prev, role }));
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo(
    () => ({ state, hydrated, setRole, update, reset }),
    [state, hydrated, setRole, update, reset],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useApp must be used inside AppStoreProvider");
  return ctx;
}

/* ---------- domain helpers ---------- */

export const CURRENT_RESIDENT = "نازنین شریفی";
export const CURRENT_UNIT = "۱۰۱";
export const CURRENT_BUILDING = "برج نگین سعادت";
export const CURRENT_PROVIDER_ID = "sp3";

export function useActions() {
  const { state, update } = useApp();

  return useMemo(
    () => ({
      /* charges */
      addCharge: (c: Omit<Charge, "id">) => update("charges", [{ ...c, id: uid("c") }, ...state.charges]),
      updateCharge: (id: string, patch: Partial<Charge>) =>
        update("charges", state.charges.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      removeCharge: (id: string) => update("charges", state.charges.filter((c) => c.id !== id)),

      /* payments */
      payCharge: (charge: Charge) => {
        update("charges", state.charges.map((c) => (c.id === charge.id ? { ...c, status: "پرداخت شده" } : c)));
        update("payments", [
          {
            id: uid("p"),
            residentName: charge.residentName,
            unitNumber: charge.unitNumber,
            amount: charge.amount,
            date: "۱۴۰۴/۰۶/۱۶",
            method: "کارت بانکی",
            status: "موفق",
            receipt: String(Math.floor(8800000 + Math.random() * 99999)).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]),
            chargeTitle: charge.title,
          },
          ...state.payments,
        ]);
        update(
          "residents",
          state.residents.map((r) =>
            r.name === charge.residentName ? { ...r, debt: Math.max(0, r.debt - charge.amount) } : r,
          ),
        );
      },

      /* units */
      addUnit: (u: Omit<Unit, "id">) => update("units", [...state.units, { ...u, id: uid("un") }]),
      updateUnit: (id: string, patch: Partial<Unit>) =>
        update("units", state.units.map((u) => (u.id === id ? { ...u, ...patch } : u))),
      removeUnit: (id: string) => update("units", state.units.filter((u) => u.id !== id)),

      /* residents */
      addResident: (r: Omit<Resident, "id">) => update("residents", [...state.residents, { ...r, id: uid("r") }]),
      updateResident: (id: string, patch: Partial<Resident>) =>
        update("residents", state.residents.map((r) => (r.id === id ? { ...r, ...patch } : r))),
      removeResident: (id: string) => update("residents", state.residents.filter((r) => r.id !== id)),

      /* expenses */
      addExpense: (e: Omit<Expense, "id">) => update("expenses", [{ ...e, id: uid("e") }, ...state.expenses]),
      removeExpense: (id: string) => update("expenses", state.expenses.filter((e) => e.id !== id)),

      /* requests */
      addRequest: (r: Omit<ServiceRequest, "id">) => update("requests", [{ ...r, id: uid("sr") }, ...state.requests]),
      setRequestStatus: (id: string, status: ServiceRequest["status"], label: string) =>
        update(
          "requests",
          state.requests.map((r) =>
            r.id === id
              ? { ...r, status, timeline: [...r.timeline, { at: "۱۴۰۴/۰۶/۱۶", label }] }
              : r,
          ),
        ),

      /* buildings */
      addBuilding: (b: Omit<Building, "id">) => update("buildings", [...state.buildings, { ...b, id: uid("b") }]),
      updateBuilding: (id: string, patch: Partial<Building>) =>
        update("buildings", state.buildings.map((b) => (b.id === id ? { ...b, ...patch } : b))),
      removeBuilding: (id: string) => update("buildings", state.buildings.filter((b) => b.id !== id)),

      /* managers */
      updateManager: (id: string, patch: Partial<Manager>) =>
        update("managers", state.managers.map((m) => (m.id === id ? { ...m, ...patch } : m))),

      /* announcements */
      addAnnouncement: (a: Omit<Announcement, "id">) =>
        update("announcements", [{ ...a, id: uid("a") }, ...state.announcements]),
      removeAnnouncement: (id: string) =>
        update("announcements", state.announcements.filter((a) => a.id !== id)),

      /* polls */
      addPoll: (p: Omit<Poll, "id">) => update("polls", [{ ...p, id: uid("pl") }, ...state.polls]),
      vote: (pollId: string, optionId: string) =>
        update(
          "polls",
          state.polls.map((p) =>
            p.id === pollId
              ? {
                  ...p,
                  votedOption: optionId,
                  options: p.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)),
                }
              : p,
          ),
        ),
      closePoll: (id: string) =>
        update("polls", state.polls.map((p) => (p.id === id ? { ...p, closed: true } : p))),

      /* suggestions */
      addSuggestion: (s: Omit<Suggestion, "id">) =>
        update("suggestions", [{ ...s, id: uid("sg") }, ...state.suggestions]),
      likeSuggestion: (id: string) =>
        update("suggestions", state.suggestions.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s))),

      /* notifications */
      markRead: (id: string) =>
        update("notifications", state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))),
      markAllRead: () => update("notifications", state.notifications.map((n) => ({ ...n, read: true }))),

      /* work slots */
      toggleSlot: (id: string) =>
        update("workSlots", state.workSlots.map((w) => (w.id === id ? { ...w, available: !w.available } : w))),
      updateSlot: (id: string, patch: Partial<WorkSlot>) =>
        update("workSlots", state.workSlots.map((w) => (w.id === id ? { ...w, ...patch } : w))),

      /* providers */
      updateProvider: (id: string, patch: Partial<Provider>) =>
        update("providers", state.providers.map((p) => (p.id === id ? { ...p, ...patch } : p))),

      /* settlements */
      requestSettlement: (amount: number) =>
        update("settlements", [
          { id: uid("st"), date: "۱۴۰۴/۰۶/۱۶", amount, commission: Math.round(amount * 0.1), status: "در انتظار" },
          ...state.settlements,
        ]),
    }),
    [state, update],
  );
}
