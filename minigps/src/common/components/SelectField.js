import {
  FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import React, { useState } from 'react';
import { useEffectAsync } from '../../reactHelper';

let base64 = require('base-64');

const SelectField = ({
  label,
  multiple,
  value,
  emptyValue = 0,
  emptyTitle = '\u00a0',
  onChange,
  endpoint,
  data,
  keyGetter = (item) => item.id,
  titleGetter = (item) => item.name,
}) => {
  const [items, setItems] = useState(data);

  useEffectAsync(async () => {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode("admin:admin"  ));
    if (endpoint) {
      const response = await fetch(endpoint, {headers: headers});
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    }
  }, []);
  console.log(endpoint);
  
  if (items) {
    return (
      <FormControl>
        <InputLabel>{label}</InputLabel>
        <Select
          label={label}
          multiple={multiple}
          value={value}
          onChange={onChange}
        >
          {!multiple && emptyValue !== null
            && <MenuItem value={emptyValue}>{emptyTitle}</MenuItem>}
          {items.map((item) => (
            <MenuItem key={keyGetter(item)} value={keyGetter(item)}>{titleGetter(item)}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  return null;
};

export default SelectField;
