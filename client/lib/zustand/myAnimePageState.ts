import { WatchStatusTypes } from "@/graphql";
import create from "zustand";

export enum DisplayMenu {
  NotWatched = "Not Watched",
  PlanningToWatch = "Planning to Watch",
  Watching = "Watching",
  Paused = "Paused",
  Completed = "Completed",
  Rewatching = "Rewatching",
  Dropped = "Dropped",
  CustomList = "Custom List",
}

interface IDisplayMenu {
  menuType: DisplayMenu;
  menuName: string;
  watchStatus?: WatchStatusTypes;
}

interface DisplayedMenu {
  displayedMenu: IDisplayMenu;
  setDisplayedMenu: (menu: IDisplayMenu) => void;
  resetState: () => void;
}

const defaultMenuItem: IDisplayMenu = {
  menuType: DisplayMenu.NotWatched,
  menuName: DisplayMenu.NotWatched,
  watchStatus: WatchStatusTypes.NotWatched,
};

export const useMyAnimePageStore = create<DisplayedMenu>((set) => ({
  displayedMenu: defaultMenuItem,
  setDisplayedMenu: (menuItem: IDisplayMenu) =>
    set(() => ({ displayedMenu: menuItem })),
  resetState: () => set(() => ({ displayedMenu: defaultMenuItem })),
}));
