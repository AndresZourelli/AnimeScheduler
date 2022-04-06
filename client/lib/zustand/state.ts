import create from "zustand";
import { SearchFilters } from "@/components/Search/SearchFilter";

interface SearchFilterExtended extends SearchFilters {
  q?: string;
}

interface UrlSearchParams {
  urlSearchParams: SearchFilterExtended;
  addSearchQuery: (query: string) => void;
  addFilterParams: (searchFilters: SearchFilterExtended) => void;
  addUrlSearchParams: (searchParams: SearchFilterExtended) => void;
}

export const useUrlSearchParams = create<UrlSearchParams>((set) => ({
  urlSearchParams: {},
  addSearchQuery: (query) =>
    set((state) => ({
      urlSearchParams: { ...state.urlSearchParams, q: query },
    })),
  addFilterParams: (searchFilters) =>
    set((state) => ({
      urlSearchParams: { q: state.urlSearchParams?.q, ...searchFilters },
    })),
  addUrlSearchParams: (searchParams) =>
    set((state) => ({
      urlSearchParams: { ...searchParams },
    })),
}));

interface LoggedInState {
  loggedIn: boolean;
  setLoginState: (value: boolean) => void;
}

export const useIsLoggedIn = create<LoggedInState>((set) => ({
  loggedIn: false,
  setLoginState: (value) => set(() => ({ loggedIn: value })),
}));
