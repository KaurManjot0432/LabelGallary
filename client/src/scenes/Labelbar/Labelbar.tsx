import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedLabel } from '../../state';

interface Tags {
    tags: Label[];
}

interface Label {
    id: number;
    name: string;
}

const LabelBar: React.FC = () => {
    const dispatch = useDispatch();
    const tags = useSelector((state: Tags) => state?.tags);

    const handleLabelClick = (label: string) => {
        dispatch(setSelectedLabel(label));
    };

    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
        >
            {tags && tags.map((tag) => (
                <Chip key={tag.id} label={tag.name} color="success" onClick={() => handleLabelClick(tag.name)} />
            ))}
        </Stack>
    );
};

export default LabelBar;
