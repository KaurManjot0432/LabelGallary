// Dropdown.tsx
import React, { ChangeEvent } from 'react';
import { MenuItem, Select } from '@material-ui/core';

interface Label {
    id: number;
    name: string;
}

interface DropdownProps {
  labels: Label[];
  onSelect: (name: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ labels, onSelect }) => {
  return (
    <Select onChange={(e: ChangeEvent<{ value: unknown }>) => onSelect(e.target.value as string)}>
      {labels.map((label) => (
        <MenuItem key={label.id} value={label.name}>
          {label.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default Dropdown;
