import { Flag, PersonSearch, ScreenSearchDesktop, Search, TravelExplore } from '@mui/icons-material'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import React from 'react'

export const SearchBar = ({ setSearchQuery, name, placeholder }) => {
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    return (
        <FormControl size='small' fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 5 }}>
            <InputLabel sx={{
                color: 'appDark.text',
                '&.Mui-focused': {
                    color: 'appDark.text', //change label color
                }
            }}>{name}</InputLabel>
            <OutlinedInput
                type="text"
                onChange={handleSearchChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            edge="end"
                            sx={{ color: 'appDark.icon' }}
                        >
                            {name == 'Nombre' ? <PersonSearch /> : name == 'Matrícula/Nómina' ? <Search /> : name == 'Materia' ? <ScreenSearchDesktop /> : name == 'Id' ? <Flag /> : name == 'Campus' ? <TravelExplore /> : <Search />}

                        </IconButton>
                    </InputAdornment>
                }
                label={name}
                placeholder={placeholder}
                sx={{
                    color: 'appDark.text',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'appDark.box', // change border color on hover
                    },
                    '&:focus-within .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'appDark.box', // change border color to transparent when focused
                    },
                    '&:not(:focus):not(:focus-within) .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'appDark.box', // change border color to white when not focused
                    },
                    borderRadius: 5,
                }}
            />
        </FormControl>
    )
}