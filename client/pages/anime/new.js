import {Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react"
import {useState, useEffect} from "react";

const AddNewAnime = () => {
    return (
        <Box p="16">
            <Tabs orientation="vertical" variant="unstyled">
                <TabList w="30%">
                    <Tab _selected={{borderRadius: "10px", bg: "teal.500"}}>One</Tab>
                    <Tab _selected={{borderRadius: "10px", bg: "teal.500"}}>Two</Tab>
                    <Tab _selected={{borderRadius: "10px", bg: "teal.500"}}>Three</Tab>
                    <Tab _selected={{borderRadius: "10px", bg: "teal.500"}}>Four</Tab>
                </TabList>
                <TabPanels w="70%">
                    <TabPanel>One</TabPanel>
                    <TabPanel>Two</TabPanel>
                    <TabPanel>Three</TabPanel>
                    <TabPanel>Four</TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

export default AddNewAnime
