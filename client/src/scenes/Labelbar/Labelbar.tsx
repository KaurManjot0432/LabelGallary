import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab'; import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedLabel, setPageNumber } from '../../state';

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
    const [value, setValue] = React.useState("");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        console.log(`Selected Label: ${newValue}`);
        dispatch(setSelectedLabel(newValue));
        dispatch(setPageNumber(1));
    };
    return (
        <>
            <Box sx={{ maxWidth: { xs: 820, sm: 1280 }, bgcolor: 'background.paper' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {tags && tags.map((tag) => (
                        <Tab key={tag.id} label={tag.name} value={tag.name} />
                    ))}
                </Tabs>
            </Box>
        </>
    );
};

export default LabelBar;
