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
  const [localRange, setLocalRange] = useState(ranges || { min: 0, max: 10 });
  return (
    <Flex px="4">
      <Box>{localRange.min}</Box>
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
              setLocalRange({ min: val[0], max: val[1] });
            }}
            onChangeEnd={(val) => {
              onChange({ min: val[0], max: val[1] });
            }}
            value={[localRange.min, localRange.max]}
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

      <Box>{localRange.max}</Box>
    </Flex>
  );
};

export default RatingRangeSlider;
