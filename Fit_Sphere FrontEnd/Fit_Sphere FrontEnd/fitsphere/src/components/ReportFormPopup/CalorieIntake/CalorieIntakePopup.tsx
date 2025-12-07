import React from 'react';
import '../popup.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());
  const [timeValue, setTimeValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

  const selectedDay = (val: any) => {
    console.log(val);
  };

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button
          className='close'
          onClick={() => {
            setShowCalorieIntakePopup(false);
          }}
        >
          <AiOutlineClose />
        </button>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
              selectedDay(newValue);
            }}
            slotProps={{
              textField: {
                color: 'warning',
              },
            }}
          />
        </LocalizationProvider>

        <TextField
          id="outlined-food-name"
          label="Food item name"
          variant="outlined"
          color="warning"
          fullWidth
          style={{ marginTop: '10px' }}
        />
        <TextField
          id="outlined-food-amount"
          label="Food item amount (in gms)"
          variant="outlined"
          color="warning"
          fullWidth
          style={{ marginTop: '10px' }}
        />

        <div className='timebox' style={{ marginTop: '20px' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeClock
              value={timeValue}
              onChange={(newValue) => setTimeValue(newValue)}
            />
          </LocalizationProvider>
        </div>

        <Button
          variant="contained"
          color="warning"
          style={{ marginTop: '20px' }}
        >
          Save
        </Button>

        <div className='hrline'></div>

        <div className='items'>
          <div className='item'>
            <h3>Apple</h3>
            <h3>100 gms</h3>
            <button><AiFillDelete /></button>
          </div>
          <div className='item'>
            <h3>Banana</h3>
            <h3>200 gms</h3>
            <button><AiFillDelete /></button>
          </div>
          <div className='item'>
            <h3>Rice</h3>
            <h3>300 gms</h3>
            <button><AiFillDelete /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieIntakePopup;
