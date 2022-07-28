import React, {useEffect, useState} from 'react';
import {DataGrid, GridCellParams, GridColDef} from '@mui/x-data-grid';
import {Box, Button, Dialog, IconButton, TextField, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {v4 as uuidv4} from 'uuid';

const columns: GridColDef[] = [
    {field: 'title', headerName: 'Title', width: 250},
    {field: 'year', headerName: 'Year', width: 150},
    {field: 'rating', headerName: 'Rating', width: 150},
    {field: 'runtime', headerName: 'Runtime', width: 150},
    {field: 'language', headerName: 'Language', width: 150},
];

interface IModal {
    open: boolean
    movieId: number | null
}

interface IComment {
    id: string
    movieId: number
    text: string
}

function App() {
    const [movies, setMovies] = useState<any[]>([]);
    const [comments, setComments] = useState<IComment[]>([]);
    const [modal, setModal] = useState<IModal>({open: false, movieId: null});
    const [value, setValue] = useState<string>('');

    // Handlers
    const handleMovieClick = (e: GridCellParams<any, any, any>) => {
        console.log(e)
        setModal({open: true, movieId: e.id as number})
    }

    const handleSendComment = () => {
        const id = uuidv4()
        console.log(id)
        setComments(prevState => [{text: value, movieId: modal.movieId as number, id}, ...prevState])
    }

    const handleDeleteComment = (commentId: string) => {
        setComments(prevState => prevState.filter(el => el.id !== commentId))
    }

    // Effects
    useEffect(() => {
        fetch('https://yts.mx/api/v2/list_movies.json?limit=50')
            .then(res => res.json())
            .then(res => {
                setMovies(res.data.movies)
            })
            .catch(err => console.warn(err))
    }, [])

    // Renders
    return (
        <>
            <Box sx={{height: '70vh', paddingX: 20, paddingY: 10}}>
                <Box sx={{height: '100%', width: '100%'}}>
                    <DataGrid
                        rows={movies}
                        columns={columns}
                        isRowSelectable={() => false}
                        onCellClick={handleMovieClick}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        initialState={{
                            pagination: {
                                pageSize: 10
                            }
                        }}
                    />
                </Box>
            </Box>
            <Dialog onClose={() => setModal({open: false, movieId: null})} open={modal.open}>
                <Box sx={{padding: 5, minWidth: 350}}>
                    <Box mb={1}>
                        <TextField
                            label="Comment"
                            multiline
                            maxRows={4}
                            value={value}
                            onChange={(e) => setValue(e.currentTarget.value)}
                            fullWidth
                            size="small"
                        />
                    </Box>
                    <Button sx={{mb: 1}} variant="outlined" onClick={handleSendComment} size="small">Send</Button>
                    <Box>
                        {comments.filter(el => el.movieId === modal.movieId).map(el => {
                            return (
                                <Box key={el.id} sx={{
                                    border: '1px solid black',
                                    paddingX: 1,
                                    marginBottom: 1,
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant="overline">{el.text}</Typography>
                                    <IconButton onClick={() => handleDeleteComment(el.id)} size="small">
                                        <DeleteIcon fontSize="small"/>
                                    </IconButton>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}

export default App;
