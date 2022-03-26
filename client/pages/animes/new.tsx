import CharacterTab from "@/components/AddNewAnime/CharacterTab";
import ExternalLinksTab from "@/components/AddNewAnime/ExternalLinksTab";
import GeneralInfoTab from "@/components/AddNewAnime/GeneralInfoTab";
import RelatedTab from "@/components/AddNewAnime/RelatedTab";
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
  youtubePreviewId: string;
  twitterTag: string;
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
interface ExternalLinks {
  title: string;
  url: string;
}

interface NewStudio {
  studioName: string;
  isPrimary: boolean;
  description: string;
}
interface NewPersonCharacter {
  givenName: string;
  surname: string;
  nativeName: string;
  altNames: AlternateName[];
  description: string;
  image: string;
}

enum MediaType {
  Movie,
  Tv,
}
interface RelatedMedia {
  mediaId: string;
  type: MediaType;
  name: string;
  imageUrl: string;
}
interface Licensor {
  licensorId: string;
}
interface Producer {
  producerId: string;
}
interface Genre {
  genreId: string;
}
interface Character {
  characterId: string;
  name: string;
  imageUrl: string;
}
interface Staff {
  personId: string;
  name: string;
  imageUrl: string;
}
interface Studio {
  studioId: string;
  studioName: string;
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
  genres: [{ genreId: "" }],
  otherNames: [{ name: "" }],
  description: "",
  myAnimeListId: "",
  youtubePreviewId: "",
  twitterTag: "",
  ageRating: "",
  selfPublished: false,
  coverImage: "",
  coverBanner: "",
  characterList: [],
  staffList: [],
  studioList: [],
  producerList: [{ producerId: "" }],
  licensorList: [{ licensorId: "" }],
  relatedMediaList: [],
  externalLinks: [],
  submissionNotes: "",
  newCharactersList: [],
  newStaffList: [],
  newStudiosList: [],
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
              <CharacterTab inputSpacingCommon={inputSpacingCommon} />
            </TabPanel>
            <TabPanel>
              <StaffTab inputSpacingCommon={inputSpacingCommon} />
            </TabPanel>
            <TabPanel>
              <StudiosTab inputSpacingCommon={inputSpacingCommon} />
            </TabPanel>
            <TabPanel>
              <RelatedTab inputSpacingCommon={inputSpacingCommon} />
            </TabPanel>
            <TabPanel>
              <ExternalLinksTab inputSpacingCommon={inputSpacingCommon} />
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
