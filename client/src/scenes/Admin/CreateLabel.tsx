import React, { useState, useEffect } from "react";
import './CreateLabel.css';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";
import { Button, Typography, Stack, Box } from "@mui/material";
import config from "../../config";

interface Token {
    token: string;
}

const CreateLabel: React.FC = () => {
    const token = useSelector((state: Token) => state?.token);
    const [registeredmsg, setRegisteredmsg] = useState<string | null>(null);
    const [errormsg, setErrormsg] = useState<string | null>('');
    const [showError, setShowError] = useState(false);
    const [showMsg, setMsg] = useState(false);
    const [labelName, setLabelName] = useState<string>('');

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
            setRegisteredmsg(null)
        }, 2000000);
    };

    useEffect(() => {
        if (registeredmsg) {
            displayMsgTimer()
        }
        if (errormsg) {
            displayErrorFor5Seconds();
        }
    }, [registeredmsg, errormsg]);

    const createLabel = async (name: string) => {
        console.log("value = ", name);
        const response = await fetch(`${config.apiUrl}/images/label`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
        });
        const parsedRes = await response.json();
        if (parsedRes.success) {
            setRegisteredmsg("Label created!");
        } else {
            setErrormsg("Error creating label..")
        }
        setLabelName('');
    }
    return (
        <>
            <div data-testid='createarea' className="createAreaContainer">
                <form className="createAreaForm"
                    onSubmit={(e) => {
                        e.preventDefault();
                        createLabel(labelName);
                    }}
                >
                    <Stack direction="column" spacing={2}>
                        <Typography className="formHeader" variant="h6">{"Add a Label"}</Typography>
                        <input
                            className="createAreaInput"
                            onChange={(e) => setLabelName(e.target.value)}
                            name="Name"
                            placeholder="Label Name"
                            value={labelName}
                        />
                        <Button variant="contained" endIcon={<AddIcon />} type="submit">
                            Create
                        </Button>
                        {showError && <p style={{ color: '#8B0000', border: '8px' }}>{errormsg}</p>}
                        {showMsg && <p style={{ color: '#008000', border: '8px' }}>{registeredmsg}</p>}
                    </Stack>
                </form>
            </div>
        </>
    );
}

export default CreateLabel;