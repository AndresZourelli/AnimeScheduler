import { useState, useEffect, useRef } from "react";
import moment from "moment";

const CountDown = ({ endInputDate }) => {
  const startDate = moment();
  const airDate = moment(endInputDate);
  let endDate = moment()
    .day(airDate.day())
    .hour(airDate.hour())
    .minute(airDate.minute())
    .second(airDate.second());
  if (startDate.weekday() >= airDate.weekday()) {
    endDate.add(1, "week");
  }

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

  let interval = useRef<NodeJS.Timer | number>(0);

  const calculateTimeLeft = () => {
    const diff: moment.Duration = moment.duration(endDate.diff(startDate));
    if (diff.asMilliseconds() > 0) {
      const days = getFormatDigit(diff.asDays());
      const hours = getFormatDigit(diff.asHours() % 24);
      const minutes = getFormatDigit(diff.asMinutes() % 60);
      const seconds = getFormatDigit(diff.asSeconds() % 60);
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

  useEffect(() => {
    interval.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => {
      clearInterval(interval.current as NodeJS.Timeout);
    };
  });

  return timeLeft;
};

export default CountDown;
