import React, { useState } from "react";
import { DatePicker, List, Provider } from "@ant-design/react-native";
import enUS from "@ant-design/react-native/lib/locale-provider/en_US";

const RoundDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(); // Renamed from value to selectedDate

  const onChangeStartDate = (newDate) => {
    setSelectedDate(newDate); // Renamed from setValue to setSelectedDate
  };

  return (
    <Provider locale={enUS}>
      <List>
        <DatePicker
          value={selectedDate} // Use selectedDate here
          minDate={new Date(2015, 7, 6)}
          maxDate={new Date(2026, 11, 3)}
          onChange={onChangeStartDate}
          format="YYYY-MM-DD"
        >
          <List.Item arrow="horizontal">Select Date</List.Item>
        </DatePicker>
      </List>
    </Provider>
  );
};

export default RoundDatePicker;
