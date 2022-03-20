import {
  Box,
  Flex,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

const RatingRangeSlider = () => {
  const { control, getValues, setValue } = useFormContext();
  const ranges = useWatch({ control, name: "score" });
  return (
    <Flex px="4">
      <Box>{ranges.min}</Box>
      <Controller
        name="score"
        control={control}
        render={({ field: { value, onChange } }) => (
          <RangeSlider
            // eslint-disable-next-line jsx-a11y/aria-proptypes
            aria-label={["min", "max"]}
            min={0}
            max={10}
            step={1}
            onChange={(val) => {
              onChange({ min: val[0], max: val[1] });
            }}
            value={[value.min, value.max]}
            mx="4"
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
        )}
      />

      <Box>{ranges.max}</Box>
    </Flex>
  );
};

export default RatingRangeSlider;
