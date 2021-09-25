import InfoSearchTab from "@/components/AddNewAnime/InfoSearchTab";
import NewStaff from "@/components/AddNewAnime/NewStaff";
import { Box, CloseButton, Flex, Heading } from "@chakra-ui/react";
import { FieldArray } from "formik";

const StaffTab = ({
  values,
  errors,
  touched,
  handleChange,
  inputSpacingCommon,
  setFieldValue,
}) => {
  return (
    <>
      <InfoSearchTab
        values={values}
        setFieldValue={setFieldValue}
        placeholder="Search For Existing Staff"
        newItem={<NewStaff values={values} setFieldValue={setFieldValue} />}
      />
      <Heading>Added Staff</Heading>
      <Flex wrap="wrap">
        <>
          <FieldArray name="newStaffList">
            {({ push, remove }) => (
              <>
                {values.newStaffList
                  .filter((value) => value.givenNameSearchBar != "")
                  .map((name, nameIndex) => (
                    <Box key={nameIndex} w="full">
                      {name.givenNameSearchBar}
                      <CloseButton
                        color="red.500"
                        onClick={() => remove(nameIndex)}
                      />
                    </Box>
                  ))}
              </>
            )}
          </FieldArray>
          <FieldArray name="staffList">
            {({ push, remove }) => (
              <>
                {values.staffList
                  .filter((value) => value.staffId != "")
                  .map((name, nameIndex) => (
                    <Box w="full" key={nameIndex}>
                      {name.staffId}
                      <CloseButton
                        color="red.500"
                        onClick={() => remove(nameIndex)}
                      />
                    </Box>
                  ))}
              </>
            )}
          </FieldArray>
        </>
      </Flex>
    </>
  );
};

export default StaffTab;
