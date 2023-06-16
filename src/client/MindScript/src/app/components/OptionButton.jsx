import { ToggleButton, Grid, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';

export const OptionButton = ({ option, changeSelected }) => {
    const theme = useTheme();
    const [selected, setSelected] = useState(false);

    const handleChange = () => {
        setSelected(!selected);
        changeSelected(option, !selected);
    };
    useEffect(() => {
        setSelected(false);

    }, [option])

    return (
        <Grid item align='center' xs={12} sm={6} mt={4}>
            <ToggleButton
                value='check'
                selected={selected}
                onChange={handleChange}
                style={{
                    color: theme.palette.appDark.text,
                    fontWeight: 900,
                    textTransform: 'none',
                    minWidth: '30vh',
                    minHeight: '7vh',
                    backgroundColor: selected ? theme.palette.appDark.adminButton : 'transparent',
                    borderColor: selected ? 'transparent' : theme.palette.appDark.box,
                    '&:hover': {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                {option}
            </ToggleButton>
        </Grid>
    );
};