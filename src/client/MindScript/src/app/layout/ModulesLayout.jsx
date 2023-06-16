import { Grid, Typography, List, IconButton, Button } from '@mui/material'
import { DeleteOutline, DomainAddSharp, Edit } from '@mui/icons-material'
import { NavBar, HomeworkBoard, SMHomeworkCard, Confirmation, EditHomework } from '../components'
import { useState } from 'react';
import { useParams } from 'react-router-dom';


export const ModulesLayout = ({ children, home, homeworkData, handleDeleteHw, handleDeleteGroup, student, hwBTitle, groupName, pages, modules }) => {
    let params = useParams();

    //Importante para EditHomework
    const [editData, setData] = useState(null);
    // console.log("ModulesLayout", modules)

    //Funciones para abrir la modal de Crear TAREA
    const [openEditHomework, setOpenEditHomework] = useState(false);
    const showModalEditHomework = () => {
        setOpenEditHomework(true);
    }
    const closeModalEditHomework = () => {
        setOpenEditHomework(false);
    }

    //Funciones para abrir la modal de Eliminar tarea
    const [openDeleteHomework, setOpenDeleteHomework] = useState(false);
    const showModalDeleteHomework = () => { setOpenDeleteHomework(true); }
    const closeModalDeleteHomework = () => {
        setOpenDeleteHomework(false);
    }

    //Funciones para abrir la modal de Eliminar tarea
    const [openDeleteGroup, setOpenDeleteGroup] = useState(false);
    const showModalDeleteGroup = () => { setOpenDeleteGroup(true); }
    const closeModalDeleteGroup = () => {
        setOpenDeleteGroup(false);
    }

    return (
        <Grid container padding={5} spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />
            < Confirmation open={openDeleteGroup} close={closeModalDeleteGroup} id={params.group} confirmationText="¿Esta seguro que desea eliminar este grupo?" handleFunction={handleDeleteGroup} confirmationTextButton="Eliminar" />


            <Grid item xs={12} sx={{ mt: 4, height: '24px' }}>
                <Button href={home} sx={{ color: 'appDark.link', fontWeight: 900, fontSize: 16 }}>
                    {'< Grupos'}
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Typography fontWeight={900} fontSize={18} sx={{ color: 'appDark.text' }}>
                    {groupName}
                </Typography>
            </Grid>

            <Grid item xs={12} md={4} lg={6} xl={7} sx={{ mt: 1 }}>
                {children}
            </Grid>

            <Grid item xs={12} md={8} lg={6} xl={5} sx={{ mt: 1 }}>

                <Grid container justifyContent='flex-end'>

                    {/* <Grid item xs={-12}> */}
                    <HomeworkBoard>
                        <Typography sx={{ fontSize: 20, fontWeight: 500, pt: 5, pb: 3 }}>{hwBTitle}</Typography>

                        <List>
                            {student ?
                                <>
                                    {homeworkData.map((data, index) => (
                                        <SMHomeworkCard key={index} data={data} index={index} />
                                    ))}
                                </>

                                :
                                <>
                                    {/* {console.log("HOMEWORKDATA", homeworkData)} */}
                                    {homeworkData[0] != undefined && homeworkData[0] != null ?
                                        homeworkData[0].map((data, index) => (
                                            <Grid key={index} container
                                                alignItems='center'
                                                sx={{ width: 300 }}
                                            >
                                                <Grid item xs={9}>
                                                    <Typography>{data.hw_name}</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <IconButton
                                                        onClick={() => {
                                                            setData(data)
                                                            showModalEditHomework()
                                                        }} sx={{ color: 'appDark.icon' }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Grid>

                                                <Grid item xs={1}>
                                                    <IconButton
                                                        onClick={() => {
                                                            setData(data.hw_id)
                                                            showModalDeleteHomework()
                                                        }} sx={{ color: 'appDark.icon' }}>
                                                        <DeleteOutline />
                                                    </IconButton>
                                                </Grid>


                                            </Grid>
                                        ))
                                        : null}


                                    < EditHomework open={openEditHomework} close={closeModalEditHomework} editData={editData} modules={modules} />
                                    < Confirmation open={openDeleteHomework} close={closeModalDeleteHomework} id={editData} confirmationText="¿Esta seguro que desea eliminar esta tarea?" handleFunction={handleDeleteHw} confirmationTextButton="Eliminar" />

                                </>
                            }
                        </List>

                    </HomeworkBoard>
                    {/* </Grid> */}

                    {!student ?
                        <>
                            {/* <Grid item xs={12}> */}
                            {/* </Grid> */}
                            {/* <Grid item xs={12}> */}

                            <Button
                                variant='contained'
                                onClick={showModalDeleteGroup}
                                sx={{
                                    width: 400, bgcolor: 'appDark.button', mb: 1,
                                    ':hover': { bgcolor: 'appDark.button', opacity: 0.8 }
                                }}
                            >
                                Borrar Grupo
                            </Button>
                            {/* </Grid> */}
                        </>
                        : null}
                </Grid>

            </Grid>

        </Grid>

    )
}