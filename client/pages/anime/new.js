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
import { Formik } from "formik";

const AddNewAnime = () => {
  const inputSpacingCommon = {
    width: "20vw",
    marginBottom: "3",
    marginRight: "2",
  };

  return (
    <Box p="16">
      <Formik
        initialValues={{
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
        }}
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
                    initialTouched={initialTouched}
                  />
                </TabPanel>
                <TabPanel>
                  <CharacterTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    initialTouched={initialTouched}
                    setFieldValue={setFieldValue}
                  />
                </TabPanel>
                <TabPanel>
                  <StaffTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    initialTouched={initialTouched}
                    setFieldValue={setFieldValue}
                  />
                </TabPanel>
                <TabPanel>
                  <StudiosTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    initialTouched={initialTouched}
                    setFieldValue={setFieldValue}
                  />
                </TabPanel>
                <TabPanel>
                  <RelatedTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    initialTouched={initialTouched}
                    setFieldValue={setFieldValue}
                  />
                </TabPanel>
                <TabPanel>
                  <ExternalLinksTab
                    inputSpacingCommon={inputSpacingCommon}
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    initialTouched={initialTouched}
                    setFieldValue={setFieldValue}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Box>
              <Button onClick={handleSubmit}>Submit</Button>
            </Box>
            <Box>{JSON.stringify(values, null, 2)}</Box>
          </>
        )}
      </Formik>
    </Box>
  );
};

export default AddNewAnime;
