import useCountDown from "@/components/Hooks/useCountDown";
import { Tag, TagProps } from "@chakra-ui/react";

interface CountDownTagProps {
  startDate: string;
}

const CountDownTag = ({
  startDate,
  ...props
}: CountDownTagProps & TagProps) => {
  const { days, hours, minutes, seconds } = useCountDown({
    endInputDate: startDate,
  });
  return (
    <Tag
      {...props}
      whiteSpace="nowrap"
    >{`${days}d ${hours}h ${minutes}m ${seconds}s`}</Tag>
  );
};

export default CountDownTag;
