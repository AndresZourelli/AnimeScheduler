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
import {} from "react-hook-form";

interface NewAnimeForm {
  titles: Titles;
  status: string;
  season: string;
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
  movie,
  tv,
}
interface RelatedMedia {
  mediaId: string;
  type: MediaType;
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
}
interface Staff {
  staffId: string;
}
interface Studio {
  studioId: string;
}
interface AlternateName {
  name: string;
}

interface DateType {
  year: number;
  month: number;
  date: number;
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

const defaultList = {
  titles: { english: "", japanese: "", romaji: "" },
  status: "",
  season: "",
  startDate: { year: "", month: "", day: "" },
  endDate: { year: "", month: "", day: "" },
  airTimeJST: { hour: "", minute: "" },
  formatType: "",
  source: "",
  countryOfOrigin: "",
  duration: "",
  numberOfEpisodes: "",
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
  characterList: [{ characterId: "" }],
  staffList: [{ staffId: "" }],
  studioList: [{ studioId: "" }],
  producerList: [{ producerId: "" }],
  licensorList: [{ licensorId: "" }],
  relatedMediaList: [{ relatedMediaId: "" }],
  externalLinks: [],
  submissionNotes: "",
  newCharactersList: [],
  newStaffList: [],
  newStudiosList: [],
};

const AddNewAnime = () => {
  const inputSpacingCommon = {
    width: "20vw",
    marginBottom: "3",
    marginRight: "2",
  };

  return (
    <Box p="16">
      <Formik
        initialValues={}
        onSubmit={(values, actions) => {
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          initialTouched,
          handleSubmit,
          setFieldValue,
        }) => (
          <>
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
                  <GeneralInfoTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                  />
                </TabPanel>
                <TabPanel>
                  <CharacterTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    push={undefined}
                  />
                </TabPanel>
                <TabPanel>
                  <StaffTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    push={undefined}
                  />
                </TabPanel>
                <TabPanel>
                  <StudiosTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    push={undefined}
                  />
                </TabPanel>
                <TabPanel>
                  <RelatedTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    push={undefined}
                  />
                </TabPanel>
                <TabPanel>
                  <ExternalLinksTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Box>
              <Button>Submit</Button>
            </Box>
            <Box>{JSON.stringify(values, null, 2)}</Box>
          </>
        )}
      </Formik>
    </Box>
  );
};

export default AddNewAnime;
