import {
  useAddAnimeToListMutation,
  useUserListsQuery,
  useUpdateUserAnimeListMutation,
  useUpdateUserAnimeWatchStatusMutation,
  WatchStatusTypes,
} from "@/graphql";
import { useAuth } from "@/lib/Auth/FirebaseAuth";
import {
  Button,
  Select,
  Td,
  Tr,
  useToast,
  Text,
  Box,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { Formik, Field } from "formik";
import moment from "moment-timezone";

interface AddToListRowInterface {
  animeId: string;
}

const AddToListRow = ({ animeId }: AddToListRowInterface) => {
  const { user } = useAuth();
  const [userLists, queryUserLists] = useUserListsQuery();
  const initialValues = {
    listId: userLists.data?.animeLists.nodes.find(
      (list) => list.title === "default"
    ).id,
    watchStatus: WatchStatusTypes.PlanToWatch,
    userScore: 0,
    episodesWatched: 0,
    startDate: moment().local(true).format("YYYY-MM-DD"),
    endDate: "",
    totalRewatched: 0,
  };
  const [selectWatchStatus, setSelectWatchStatus] = useState<WatchStatusTypes>(
    WatchStatusTypes.Watching
  );
  const [selectListId, setSelectListId] = useState("");

  const [updateAnimeListResult, runUpdateToAnimeList] =
    useAddAnimeToListMutation();
  const [updateAnimeWatchStatus, runUpdateAnimeWatchStatus] =
    useUpdateUserAnimeWatchStatusMutation();

  const [changeAnimeList, runChangeAnimeList] =
    useUpdateUserAnimeListMutation();
  const toast = useToast();
  // const addAnimeToListCall = async (userListId: string) => {
  //   const result = await runAddToAnimeList({
  //     animeId,
  //     animeListId: userListId,
  //     watchingStatus: selectValue,
  //   });
  //   if (result.data.upsertUserAnimeList) {
  //     toast({
  //       title: "Anime added to list!",
  //       description: `"${animeTitle}" added to "${listTitle}".`,
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //   }
  //   if (result.error) {
  //     toast({
  //       title: "Could not add anime to list!",
  //       description: `"${animeTitle}" could not be added to "${listTitle}".`,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //   }
  // };
  const onSelectStatusWatchChange = (e) => {
    setSelectWatchStatus(e.target.value);
  };
  const submitStatusWatch = () => {
    runUpdateAnimeWatchStatus({
      animeId: animeId,
      userId: user?.uid,
      watchStatus: selectWatchStatus,
    });
  };
  const onSelectListIdChange = (e) => {
    setSelectListId(e.target.value);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ values, handleChange, submitForm }) => (
        <Box mb="4">
          <Grid templateColumns="repeat(4,1fr)" gap={4} w="full" mb="4">
            <GridItem colSpan={2} mr="0">
              <Box display="flex">
                <Field name="listId">
                  {({ field, form }) => (
                    <FormControl>
                      <FormLabel>Add to List:</FormLabel>
                      <Select
                        size="sm"
                        mr="2%"
                        onChange={onSelectListIdChange}
                        {...field}
                      >
                        {userLists.data?.animeLists.nodes.map((list) => (
                          <option key={list.id} value={list.id}>
                            {list.title}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Field>
              </Box>
            </GridItem>
            <GridItem colSpan={2}>
              <Box display="flex">
                <Field name="watchStatus">
                  {({ field, form }) => (
                    <FormControl>
                      <FormLabel>Status:</FormLabel>
                      <Select
                        size="sm"
                        mr="2%"
                        onChange={onSelectStatusWatchChange}
                        {...field}
                      >
                        <option value="">
                          Please select a watching status...
                        </option>
                        <option value={WatchStatusTypes.Watching}>
                          Watching
                        </option>
                        <option value={WatchStatusTypes.PlanToWatch}>
                          Plan to watch
                        </option>
                        <option value={WatchStatusTypes.Paused}>Paused</option>
                        <option value={WatchStatusTypes.Completed}>
                          Completed
                        </option>
                        <option value={WatchStatusTypes.Dropped}>
                          Dropped
                        </option>
                        <option value={WatchStatusTypes.Rewatching}>
                          Rewatching
                        </option>
                      </Select>
                    </FormControl>
                  )}
                </Field>
              </Box>
            </GridItem>
            <GridItem>
              <Box display="flex">
                <Field name="userScore">
                  {({ field, form }) => (
                    <FormControl>
                      <FormLabel>Score:</FormLabel>
                      <Select size="sm" mr="2%" {...field}>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                        <option value={10}>10</option>
                      </Select>
                    </FormControl>
                  )}
                </Field>
              </Box>
            </GridItem>
            <GridItem>
              <Box display="flex">
                <Field name="episodesWatched">
                  {({ field, form: { setFieldValue } }) => (
                    <FormControl>
                      <FormLabel>Episodes Watched:</FormLabel>
                      <NumberInput
                        defaultValue={0}
                        min={0}
                        size="sm"
                        {...field}
                        onChange={(value) =>
                          setFieldValue("episodesWatched", value)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  )}
                </Field>
              </Box>
            </GridItem>
            <GridItem>
              <Box display="flex">
                <Field name="startDate">
                  {({ field, form }) => (
                    <FormControl>
                      <FormLabel>Start Date:</FormLabel>
                      <Input type="date" size="sm" {...field} />
                    </FormControl>
                  )}
                </Field>
              </Box>
            </GridItem>
            <GridItem>
              <Box display="flex">
                <Field name="endDate">
                  {({ field, form }) => (
                    <FormControl>
                      <FormLabel>End Date:</FormLabel>

                      <Input type="date" size="sm" {...field} />
                    </FormControl>
                  )}
                </Field>
              </Box>
            </GridItem>
            <GridItem>
              <Box display="flex">
                <Field name="totalRewatched">
                  {({ field, form: { setFieldValue } }) => (
                    <FormControl>
                      <FormLabel>Total Rewatched:</FormLabel>
                      <NumberInput
                        defaultValue={0}
                        min={0}
                        size="sm"
                        {...field}
                        onChange={(value) =>
                          setFieldValue("totalRewatched", value)
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  )}
                </Field>
              </Box>
            </GridItem>
          </Grid>
          <Button onClick={submitForm} colorScheme="blue">
            Save
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export default AddToListRow;
