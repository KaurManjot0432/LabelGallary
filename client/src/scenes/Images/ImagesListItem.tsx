import React, { useState } from 'react';
import { ImageListItem, ImageListItemBar, IconButton, Stack, Chip, Tooltip, Avatar, Menu } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import { MenuItem } from '@material-ui/core';
import config from '../../config';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';

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


interface ImageItemProps {
    image: {
        id: string;
        file_name: string;
        file_type: string;
        presigned_url: string;
        labels: string[];
    };
}


const ImagesListItem: React.FC<ImageItemProps> = ({ image }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
    });
    const token = useSelector((state: Token) => state?.token);
    const labels = useSelector((state: Tags) => state?.tags);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [imageLabels, setImagelables] = useState<string[]>(image.labels);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
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
            const parsedResponse = await response.json();
            setImagelables(parsedResponse.labels);
            console.log(imageLabels);
        } catch (error) {
            console.error('Error assigning label:', error);
        }
    };
    return (
        <>
            <ImageListItem key={image.presigned_url}>
                <img
                    ref={ref}
                    src={inView ? image.presigned_url : undefined}
                    alt={image.file_name}
                />
                <ImageListItemBar
                    position="bottom"
                    actionIcon={
                        <Tooltip title="Add a new Label">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar sx={{ width: 28, height: 28 }}><AddIcon color="success" /></Avatar>
                            </IconButton>
                        </Tooltip>
                    }
                    actionPosition="left"
                    subtitle={
                        <Stack direction="row" spacing={1}>
                            {imageLabels && imageLabels.map((label) => (
                                <Chip label={label} color="success" size="small" key={label}></Chip>
                            ))}
                        </Stack>}
                >
                </ImageListItemBar>
            </ImageListItem>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {labels.map((label) => (
                    <MenuItem key={label.id} value={label.name} onClick={() => (handleLabelSelect(label.name, image.id))}>
                        {label.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default ImagesListItem;
