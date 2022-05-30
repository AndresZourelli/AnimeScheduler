import { Collapse, Icon, Stack, useDisclosure } from "@chakra-ui/react";
import SidebarItem from "@/components/Common/Sidebar/SidebarItem";
import { MdKeyboardArrowRight } from "react-icons/md";
import useAnimeList from "@/components/Hooks/useAnimeList";
import { WatchStatusTypes } from "@/graphql";
import {
  DisplayMenu,
  useMyAnimePageStore,
} from "@/lib/zustand/myAnimePageState";

const MyAnimePageSidebar = (props) => {
  const { isOpen, onToggle } = useDisclosure();
  const { userAnimeLists } = useAnimeList({});
  const { displayedMenu, setDisplayedMenu } = useMyAnimePageStore();

  return (
    <Stack fontSize="small" {...props}>
      {menuItems.menu.map((item) => (
        <SidebarItem
          key={item.watchStatus}
          isActive={displayedMenu.menuType === item.menuType}
          onClick={() => {
            setDisplayedMenu({
              menuName: item.title,
              menuType: item.menuType,
              watchStatus: item.watchStatus,
            });
          }}
        >
          {item.title}
        </SidebarItem>
      ))}
      <SidebarItem onClick={onToggle}>
        Custom Lists{" "}
        <Icon
          as={MdKeyboardArrowRight}
          ml="auto"
          transform={isOpen ? "rotate(90deg)" : "unset"}
          transition={"ease-in-out .3s"}
          boxSize={6}
        />
      </SidebarItem>
      <Collapse in={isOpen}>
        {userAnimeLists
          .sort((a, b) => {
            if (a.title === "default") {
              return -1;
            } else if (b.title === "default") {
              return 1;
            }
            return 0;
          })
          .map((list, idx) => (
            <SidebarItem
              key={list.id}
              ml="4"
              onClick={() => {
                setDisplayedMenu({
                  menuType: DisplayMenu.CustomList,
                  menuName: list.id,
                });
              }}
              isActive={displayedMenu.menuName === list.id}
            >
              {list.title}
            </SidebarItem>
          ))}
      </Collapse>
    </Stack>
  );
};

export default MyAnimePageSidebar;

interface MenuItem {
  title: string;
  watchStatus?: WatchStatusTypes;
  menuType: DisplayMenu;
}

interface Menu {
  menu: MenuItem[];
}

const menuItems: Menu = {
  menu: [
    {
      title: "Not Watched",
      watchStatus: WatchStatusTypes.NotWatched,
      menuType: DisplayMenu.NotWatched,
    },
    {
      title: "Planning to Watch",
      watchStatus: WatchStatusTypes.PlanToWatch,
      menuType: DisplayMenu.PlanningToWatch,
    },
    {
      title: "Watching",
      watchStatus: WatchStatusTypes.Watching,
      menuType: DisplayMenu.Watching,
    },
    {
      title: "Paused",
      watchStatus: WatchStatusTypes.Paused,
      menuType: DisplayMenu.Paused,
    },
    {
      title: "Completed",
      watchStatus: WatchStatusTypes.Completed,
      menuType: DisplayMenu.Completed,
    },
    {
      title: "Rewatching",
      watchStatus: WatchStatusTypes.Rewatching,
      menuType: DisplayMenu.Rewatching,
    },
    {
      title: "Dropped",
      watchStatus: WatchStatusTypes.Dropped,
      menuType: DisplayMenu.Dropped,
    },
  ],
};
