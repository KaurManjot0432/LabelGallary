import React, { useState, ChangeEvent, useEffect } from 'react';
import config from '../../config';
import { useSelector } from 'react-redux';
import { Button, Typography, Stack } from "@mui/material";
import './CreateLabel.css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Token {
    token: string;
}

interface DirectUploadData {
    file_name: string;
    file_type: string;
    file: File;
}

const UploadFile = () => {
    const token = useSelector((state: Token) => state?.token);
    const [fileInput, setFile] = React.useState<File | null>(null)
    const [registeredmsg, setRegisteredmsg] = useState<string | null>(null);
    const [errormsg, setErrormsg] = useState<string | null>('');
    const [showError, setShowError] = useState(false);
    const [showMsg, setMsg] = useState(false);

    const displayErrorFor5Seconds = () => {
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
            setErrormsg(null);
        }, 2000);
    };

    const displayMsgTimer = () => {
        setMsg(true);
        setTimeout(() => {
            setMsg(false);
            setRegisteredmsg(null);
        }, 2000);
    };

    useEffect(() => {
        if (registeredmsg) {
            displayMsgTimer();
        }
        if (errormsg) {
            displayErrorFor5Seconds();
        }
    }, [registeredmsg, errormsg]);

    const directUploadStart = async ({ file_name, file_type, file }: DirectUploadData) => {
        setRegisteredmsg("Uploading file...");
        setFile(null);
        const values = { file_name, file_type };
        try {
            // Make a request to get the presigned URL
            const signedUrlResponse = await fetch(`${config.apiUrl}/images/upload-image/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });

            if (signedUrlResponse.ok) {
                const signedUrlData = await signedUrlResponse.json();
                try {
                    await uploadFileToS3(file, signedUrlData.url, signedUrlData.fields);
                    await directUploadFinish({ file_id: signedUrlData.id });
                    setRegisteredmsg('File upload completed!');
                } catch (err) {
                    setErrormsg('Error uploading image');
                }
            } else {
                setErrormsg('Error obtaining presigned URL');
            }
        } catch (error) {
            setErrormsg('File upload failed!');
        }
    };

    const uploadFileToS3 = async (file: File, url: string, fields: any) => {
        try {
            const formData = new FormData();

            // Append additional fields to the FormData
            Object.keys(fields).forEach((key) => {
                formData.append(key, fields[key]);
            });

            // Append the file to the FormData
            formData.append('file', file);

            // Use the presigned URL to upload the file to S3
            await fetch(url, {
                method: 'POST',
                body: formData,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const directUploadFinish = async ({ file_id }: { file_id: number }) => {
        // Make a request to notify Django about the completion of the upload
        await fetch(`${config.apiUrl}/images/upload-image/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ file_id }),
        });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };


    const fileData = () => {
        if (fileInput) {
            return (
                <div className="container my-3">
                    <p>Selected File : {fileInput.name}</p>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<UploadFileIcon />}
                        onClick={() => {
                            directUploadStart({
                                file_name: fileInput.name,
                                file_type: fileInput.type,
                                file: fileInput,
                            });
                        }}
                    >
                        Upload
                    </Button>
                </div>
            );
        }
    };

    return (
        <>
            <div data-testid='createarea' className="createAreaContainer">
                <form className="createAreaForm" >
                    <Stack direction="column" spacing={2}>
                        <Typography className="formHeader" variant="h6">{"Add an Image"}</Typography>
                        <label htmlFor="file-input">
                            <input
                                type="file"
                                id="file-input"
                                style={{ display: 'none' }}
                                onChange={handleChange}
                            />
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<AttachFileIcon />}
                            >
                                Attach File
                            </Button>
                        </label>
                        {fileData()}
                        {showError && <p style={{ color: '#8B0000', border: '8px' }}>{errormsg}</p>}
                        {showMsg && <p style={{ color: '#008000', border: '8px' }}>{registeredmsg}</p>}
                    </Stack>
                </form>
            </div>
        </>
    );
};

export default UploadFile;
