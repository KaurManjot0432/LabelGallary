import React, { ChangeEvent } from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import config from '../../config';

interface Token {
  token: string;
}

interface Tags {
  tags: Label[];
}

interface Label {
  id: number;
  name: string;
}


interface DropdownProps {
  imageId: string;
}

const Dropdown: React.FC<DropdownProps> = ({imageId}) => {
  const dispatch = useDispatch();
  const token = useSelector((state: Token) => state?.token);
  const labels = useSelector((state: Tags) => state?.tags);

  const handleLabelSelect = async (
    label: string,
    imageId: string
  ) => {
    try {
      const response = await fetch(`${config.apiUrl}/images/label-image/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          label
        }),
      });

      if (response.ok) {
        console.log(response);
      } else {
        console.log('got error');
      }
    } catch (error) {
      console.error('Error assigning label:', error);
    }
  };
  return (
    <Select onChange={(e: ChangeEvent<{ value: unknown }>) => handleLabelSelect(e.target.value as string, imageId)}>
      {labels.map((label) => (
        <MenuItem key={label.id} value={label.name}>
          {label.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default Dropdown;
