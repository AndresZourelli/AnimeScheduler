import {
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Spacer,
  Heading,
  Select,
  InputRightElement,
  InputGroup,
  CloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import { Formik, FieldArray, Field, getIn, Form } from "formik";
import GeneralInfoTab from "@/components/GeneralInfoTab";
import CharacterTab from "@/components/CharacterTab";
import StaffTab from "@/components/StaffTab";

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
          externalLinks: [{ externalUrl: "" }],
          submissionNotes: "",
          newCharactersList: [
            {
              givenNameSearchBar: "",
              surnameSearchBar: "",
              nativeNameSearchBar: "",
              altNamesSearchBar: [{ name: "" }],
              image: "",
              description: "",
            },
          ],
          newStaffList: [
            {
              givenNameSearchBar: "",
              surnameSearchBar: "",
              nativeNameSearchBar: "",
              altNamesSearchBar: [{ name: "" }],
              description: "",
              language: "",
              image: "",
            },
          ],
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
                <TabPanel>Four</TabPanel>
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
