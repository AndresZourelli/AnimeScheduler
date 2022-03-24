import {
  addWeeks,
  getDay,
  getHours,
  getMinutes,
  getSeconds,
  intervalToDuration,
  isAfter,
  isFuture,
  set,
  setDay,
} from "date-fns";
import { useEffect, useRef, useState } from "react";

const useCountDown = ({ endInputDate = null }) => {
  const [rDays, setRDays] = useState("00");
  const [rHours, setRHours] = useState("00");
  const [rMinutes, setRMinutes] = useState("00");
  const [rSeconds, setRSeconds] = useState("00");
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  let interval = useRef<NodeJS.Timer | number>(0);

  useEffect(() => {
    interval.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => {
      clearInterval(interval.current as NodeJS.Timeout);
    };
  });
  if (!endInputDate) {
    return timeLeft;
  }
  const startDate = new Date();
  const airDate = new Date(endInputDate);
  let thisWeekEpisode = set(new Date(), {
    hours: getHours(airDate),
    minutes: getMinutes(airDate),
    seconds: getSeconds(airDate),
  });

  thisWeekEpisode = setDay(thisWeekEpisode, getDay(airDate));

  if (isAfter(startDate, thisWeekEpisode)) {
    thisWeekEpisode = addWeeks(thisWeekEpisode, 1);
  }
  const getFormatDigit = (digit) => {
    const value = Math.floor(digit);

    if (value <= 0) {
      return "00";
    }
    const digitLength = value.toString().length;
    if (digitLength > 1) {
      return value.toString();
    }
    return "0" + value.toString();
  };

  const calculateTimeLeft = () => {
    if (isFuture(thisWeekEpisode)) {
      const interval = intervalToDuration({
        start: startDate,
        end: thisWeekEpisode,
      });
      const days = getFormatDigit(interval.days);
      const hours = getFormatDigit(interval.hours);
      const minutes = getFormatDigit(interval.minutes);
      const seconds = getFormatDigit(interval.seconds);
      setRDays(days);
      setRHours(hours);
      setRMinutes(minutes);
      setRSeconds(seconds);
      return {
        days,
        hours,
        minutes,
        seconds,
      };
    }
    return {
      days: rDays,
      hours: rHours,
      minutes: rMinutes,
      seconds: rSeconds,
    };
  };

  return timeLeft;
};

export default useCountDown;
