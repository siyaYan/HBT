import React, { useState } from "react";
import { DatePicker, List, Provider } from "@ant-design/react-native";
import enUS from "@ant-design/react-native/lib/locale-provider/en_US";
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import View from "native-base"

// const RoundDatePicker = () => {
//   const [selectedDate, setSelectedDate] = useState(); // Renamed from value to selectedDate

//   const onChangeStartDate = (newDate) => {
//     setSelectedDate(newDate); // Renamed from setValue to setSelectedDate
//   };

//   return (
//     <Provider locale={enUS}>
//       <List>
//         <DatePicker
//           value={selectedDate} // Use selectedDate here
//           minDate={new Date(2015, 7, 6)}
//           maxDate={new Date(2026, 11, 3)}
//           onChange={onChangeStartDate}
//           format="YYYY-MM-DD"
//         >
//           <List.Item arrow="horizontal">Select Date</List.Item>
//         </DatePicker>
//       </List>
//     </Provider>
//   );
// };

// export default RoundDatePicker;

export default function RoundDatePicker() {
  const [date, setDate] = useState(dayjs());

  return (
    <View>
      <DateTimePicker
        mode="single"
        date={date}
        onChange={(params) => setDate(params.date)}
      />
    </View>
  );
}
