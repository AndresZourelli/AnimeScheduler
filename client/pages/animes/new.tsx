import CharacterTab from "@/components/AddNewAnime/CharacterTab";
import ExternalLinksTab from "@/components/AddNewAnime/ExternalLinksTab";
import GeneralInfoTab from "@/components/AddNewAnime/GeneralInfoTab";
import LicensorTab from "@/components/AddNewAnime/LicensorTab";
import NewCharacter from "@/components/AddNewAnime/NewCharacter";
import NewLicensor from "@/components/AddNewAnime/NewLicensor";
import NewProducer from "@/components/AddNewAnime/NewProducer";
import NewStaff from "@/components/AddNewAnime/NewStaff";
import NewStudio from "@/components/AddNewAnime/NewStudio";
import ProducersTab from "@/components/AddNewAnime/ProducersTab";
import RelatedTab from "@/components/AddNewAnime/RelatedTab";
import SelectedCharactersTab from "@/components/AddNewAnime/SelectItemForm/SelectedCharactersTab";
import SelectedLicensorTab from "@/components/AddNewAnime/SelectItemForm/SelectedLicensorTab";
import SelectedProducerTab from "@/components/AddNewAnime/SelectItemForm/SelectedProducerTab";
import SelectedRelatedMediaTab from "@/components/AddNewAnime/SelectItemForm/SelectedRelatedMediaTab";
import SelectedStaffTab from "@/components/AddNewAnime/SelectItemForm/SelectedStaffTab";
import SelectedStudioTab from "@/components/AddNewAnime/SelectItemForm/SelectedStudioTab";
import StaffTab from "@/components/AddNewAnime/StaffTab";
import StudiosTab from "@/components/AddNewAnime/StudiosTab";
import {
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";

interface NewAnimeForm {
  titles: Titles;
  status: string;
  airingSeason: Season;
  startDate: DateType;
  endDate: DateType;
  airTimeJST: TimeType;
  formatType: string;
  source: string;
  countryOfOrigin: string;
  duration: number;
  numberOfEpisodes: number;
  genres: Genre[];
  otherNames: AlternateName[];
  description: string;
  myAnimeListId: string;
  youtubeTrailerId: string;
  twitterHandle: string;
  officialWebsite: string;
  ageRating: string;
  selfPublished: false;
  coverImage: string;
  coverBanner: string;
  characterList: Character[];
  staffList: Staff[];
  studioList: Studio[];
  producerList: Producer[];
  licensorList: Licensor[];
  relatedMediaList: RelatedMedia[];
  externalLinks: ExternalLinks[];
  submissionNotes: string;
  newCharactersList: NewPersonCharacter[];
  newStaffList: NewPersonCharacter[];
  newStudiosList: NewStudio[];
  newLicensorsList: NewLicensor[];
  newProducersList: NewProducer[];
}

enum SeasonEnum {
  Winter = "winter",
  Spring = "spring",
  Summer = "summer",
  Fall = "fall",
}
interface Season {
  season: SeasonEnum;
  year: number;
}
interface ExternalLinks extends NewItems {
  url: string;
}

interface NewLicensor extends NewItems {}
interface NewProducer extends NewItems {}
interface NewStudio extends NewItems {
  isPrimary: boolean;
  description: string;
}

interface NewItems {
  itemId: string;
  name: string;
  imageUrl?: string;
}

interface NewPersonCharacter extends NewItems {
  givenName: string;
  surname: string;
  nativeName: string;
  altNames: AlternateName[];
  description: string;
}

enum MediaType {
  Movie,
  Tv,
}
interface RelatedMedia extends NewItems {
  mediaId: string;
  type: MediaType;
}
interface Licensor extends NewItems {
  licensorId: string;
}
interface Producer extends NewItems {
  producerId: string;
}
interface Genre {
  genreId: string;
}
interface Character extends NewItems {
  characterId: string;
}
interface Staff extends NewItems {
  personId: string;
}
interface Studio extends NewItems {
  studioId: string;
}
interface AlternateName {
  name: string;
}

interface DateType {
  year: number;
  month: number;
  day: number;
}

interface TimeType {
  hour: number;
  minute: number;
}

interface Titles {
  english: string;
  japanese: string;
  romaji?: string;
}

const defaultList: NewAnimeForm = {
  titles: { english: "", japanese: "", romaji: "" },
  status: "",
  airingSeason: { season: SeasonEnum.Winter, year: 0 },
  startDate: { year: 0, month: -1, day: 0 },
  endDate: { year: 0, month: -1, day: 0 },
  airTimeJST: { hour: 0, minute: 0 },
  formatType: "",
  source: "",
  countryOfOrigin: "",
  duration: 0,
  numberOfEpisodes: 0,
  genres: [],
  otherNames: [{ name: "" }],
  description: "",
  myAnimeListId: "",
  youtubeTrailerId: "",
  twitterHandle: "",
  officialWebsite: "",
  ageRating: "",
  selfPublished: false,
  coverImage: "",
  coverBanner: "",
  characterList: [],
  staffList: [],
  studioList: [],
  producerList: [],
  licensorList: [],
  relatedMediaList: [],
  externalLinks: [],
  submissionNotes: "",
  newCharactersList: [],
  newStaffList: [],
  newStudiosList: [],
  newProducersList: [],
  newLicensorsList: [],
};

const inputSpacingCommon = {
  width: "20vw",
  marginBottom: "3",
  marginRight: "2",
};
const AddNewAnime = () => {
  const methods = useForm<NewAnimeForm>({ defaultValues: defaultList });
  return (
    <FormProvider {...methods}>
      <Box p="16">
        <Tabs orientation="vertical" variant="unstyled">
          <TabList w="30%">
            <Tab _selected={{ borderRadius: "10px", bg: "teal.500" }}>
              General Info
            </Tab>
            <Tab _selected={{ borderRadius: "10px", bg: "teal.500" }}>
              Characters
            </Tab>
            <Tab _selected={{ borderRadius: "10px", bg: "teal.500" }}>
              Staff
            </Tab>
            <Tab _selected={{ borderRadius: "10px", bg: "teal.500" }}>
              Studios
            </Tab>
            <Tab _selected={{ borderRadius: "10px", bg: "teal.500" }}>
              Producers
            </Tab>
            <Tab _selected={{ borderRadius: "10px", bg: "teal.500" }}>
              Licensors
            </Tab>
            <Tab _selected={{ borderRadius: "10px", bg: "teal.500" }}>
              Related
            </Tab>
            <Tab _selected={{ borderRadius: "10px", bg: "teal.500" }}>
              External Links
            </Tab>
          </TabList>
          <TabPanels w="70%">
            <TabPanel>
              <GeneralInfoTab inputSpacingCommon={inputSpacingCommon} />
            </TabPanel>
            <TabPanel>
              <SelectedCharactersTab
                addItemTitle="Character List"
                placeholder="Search for character"
                existingListName="characterList"
                newItemComponent={NewCharacter}
                newListName="newCharactersList"
              />
            </TabPanel>
            <TabPanel>
              <SelectedStaffTab
                addItemTitle="Staff List"
                placeholder="Search for staff"
                existingListName="staffList"
                newItemComponent={NewStaff}
                newListName="newStaffList"
              />
            </TabPanel>
            <TabPanel>
              <SelectedStudioTab
                addItemTitle="Studio List"
                placeholder="Search for studio"
                existingListName="studioList"
                newItemComponent={NewStudio}
                newListName="newStudiosList"
              />
            </TabPanel>
            <TabPanel>
              <SelectedProducerTab
                addItemTitle="Producer List"
                placeholder="Search for producer"
                existingListName="producerList"
                newItemComponent={NewProducer}
                newListName="newProducersList"
              />
            </TabPanel>
            <TabPanel>
              <SelectedLicensorTab
                addItemTitle="Licensor List"
                placeholder="Search for licensor"
                existingListName="licensorList"
                newItemComponent={NewLicensor}
                newListName="newLicensorsList"
              />
            </TabPanel>
            <TabPanel>
              <SelectedRelatedMediaTab
                addItemTitle="Related Media List"
                placeholder="Search for related media"
                existingListName="relatedMediaList"
              />
            </TabPanel>
            <TabPanel>
              <ExternalLinksTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Box>
          <Button
            onClick={() => {
              console.log(methods.getValues());
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default AddNewAnime;
