 

import React, { useState, useRef, useEffect } from 'react'
import { FormGroup } from '@material-ui/core';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import communesjson from "../json/communes.json";

import FormControlLabel from '@mui/material/FormControlLabel';
import { useSelector, useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { updatePost } from '../../redux/actions/postAction';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


import { imageShow, videoShow } from '../../utils/mediaShow'
import { createPostpendiente } from '../../redux/actions/postaproveAction';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const names = [
    'Mariages (حفلات الزفاف)',
    'Fiançailles (الخطبة)',
    'Aqiqah (عقيقة)',
    'khitan (ختان)',
    'Baptêmes (التعميد)',
    'Anniversaires (الذكرى)',
    'Diplômes (التخرج)',
    'Fêtes d\'anniversaire (حفلات عيد الميلاد)',
    'Réunions familiales (اجتماعات عائلية)',
    'Événements d\'entreprise (الأحداث الشركات)',
    'Conférences (المؤتمرات)',
    'Séminaires (الندوات)',
    'Expositions (المعارض)',
    'Circoncision (الختان)',
    'Réunion (الاجتماع)',
    'Dîner (العشاء)',
    'Buffet (البوفيه)',
    'Cafétéria (المقهى)',
    'Salle (القاعة)',
    'Fêtes (الاحتفالات)'
];






const StatusModalsalle = () => {



    const { auth, theme, status, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const initialState = {

        selectedOption: '',


        option: '',
        hasFeature1: false,

        hasFeature2: false,


        additionalCheckbox1: false, // Campo adicional para el Checkbox 1
        additionalCheckbox2: false, // Campo adicional para el Checkbox 2



    };

    const [postData, setPostdata] = useState(initialState);
    const [images, setImages] = useState([])

    const [stream, setStream] = useState(false)
    const videoRef = useRef()
    const refCanvas = useRef()
    const [tracks, setTracks] = useState('')
    const [selectedWilaya, setSelectedWilaya] = useState([]);
    const [selectedCommune, setSelectedCommune] = useState([]);




    //--------------------------------------







    const handleChangeImages = e => {
        const files = [...e.target.files]
        let err = ""
        let newImages = []

        files.forEach(file => {
            if (!file) return err = "File does not exist."

            if (file.size > 1024 * 1024 * 5) {
                return err = "The image/video largest is 5mb."
            }

            return newImages.push(file)
        })

        if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
        setImages([...images, ...newImages])
    }

    const deleteImages = (index) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const handleStream = () => {
        setStream(true)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(mediaStream => {
                    videoRef.current.srcObject = mediaStream
                    videoRef.current.play()

                    const track = mediaStream.getTracks()
                    setTracks(track[0])
                }).catch(err => console.log(err))
        }
    }

    const handleCapture = () => {
        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;

        refCanvas.current.setAttribute("width", width)
        refCanvas.current.setAttribute("height", height)

        const ctx = refCanvas.current.getContext('2d')
        ctx.drawImage(videoRef.current, 0, 0, width, height)
        let URL = refCanvas.current.toDataURL()
        setImages([...images, { camera: URL }])
    }

    const handleStopStream = () => {
        tracks.stop()
        setStream(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (images.length === 0) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: 'Please add your photo.' },
            });
        }

        if (status.onEdit) {
            dispatch(updatePost({ postData, images, auth, status }));
        } else {
            dispatch(createPostpendiente({ postData, images, auth, socket }));
        }

        setPostdata(initialState);

        setImages([]);
        setStream(false);

        dispatch({ type: GLOBALTYPES.STATUS, payload: false });
    };

    useEffect(() => {
        if (status.onEdit) {
            setPostdata({
                ...status,
            });
            setImages(status.images);

        }
    }, [status]);





    return (


        <Card>
            <CardContent>

                <div className="status_modal">
                    <form onSubmit={handleSubmit}>

                        <FormGroup>
                            <div className="status_header">
                                <h5 className="m-0">Create Post</h5>
                                <span onClick={() => dispatch({
                                    type: GLOBALTYPES.STATUS,
                                    payload: false
                                })}>
                                    &times;
                                </span>
                            </div>
                        </FormGroup>

                        <div className="status_body">


                            <FormGroup>
                                <hr></hr>




                                <FormControl>
                                    <InputLabel id="option-label">Seleccione una opción</InputLabel>
                                    <Select
                                        labelId="option-label"
                                        value={postData.option}
                                        onChange={(e) =>
                                            setPostdata({ ...postData, option: e.target.value })
                                        }
                                    >
                                        <MenuItem value="feature1">Característica 1</MenuItem>
                                        <MenuItem value="feature2">Característica 2</MenuItem>
                                    </Select>
                                </FormControl>
                            </FormGroup>

                            {postData.option === 'feature1' && (
                                <div className="option-details">
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={postData.hasFeature1}
                                                    onChange={(e) =>
                                                        setPostdata({
                                                            ...postData,
                                                            hasFeature1: e.target.checked,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Tiene Característica 1"
                                        />

                                    </FormGroup>
                                </div>
                            )}

                            {postData.option === 'feature2' && (
                                <div className="option-details">
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={postData.hasFeature2}
                                                    onChange={(e) =>
                                                        setPostdata({
                                                            ...postData,
                                                            hasFeature2: e.target.checked,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Tiene Característica 2"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={postData.additionalCheckbox1}
                                                    onChange={(e) =>
                                                        setPostdata({
                                                            ...postData,
                                                            additionalCheckbox1: e.target.checked,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Opción Adicional 1"
                                        />


                                    </FormGroup>
                                </div>
                            )}








                            <br></br>









                            <div className="show_images">
                                {
                                    images.map((img, index) => (
                                        <div key={index} id="file_img">
                                            {
                                                img.camera ? imageShow(img.camera, theme)
                                                    : img.url
                                                        ? <>
                                                            {
                                                                img.url.match(/video/i)
                                                                    ? videoShow(img.url, theme)
                                                                    : imageShow(img.url, theme)
                                                            }
                                                        </>
                                                        : <>
                                                            {
                                                                img.type.match(/video/i)
                                                                    ? videoShow(URL.createObjectURL(img), theme)
                                                                    : imageShow(URL.createObjectURL(img), theme)
                                                            }
                                                        </>
                                            }
                                            <span onClick={() => deleteImages(index)}>&times;</span>
                                        </div>
                                    ))
                                }
                            </div>

                            {
                                stream &&
                                <div className="stream position-relative">
                                    <video autoPlay muted ref={videoRef} width="100%" height="100%"
                                        style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />

                                    <span onClick={handleStopStream}>&times;</span>
                                    <canvas ref={refCanvas} style={{ display: 'none' }} />
                                </div>
                            }

                            <div className="input_images">
                                {
                                    stream
                                        ? <i className="fas fa-camera" onClick={handleCapture} />
                                        : <>
                                            <i className="fas fa-camera" onClick={handleStream} />

                                            <div className="file_upload">
                                                <i className="fas fa-image" />
                                                <input type="file" name="file" id="file"
                                                    multiple accept="image/*,video/*" onChange={handleChangeImages} />
                                            </div>
                                        </>
                                }

                            </div>

                        </div>

                        <div className="status_footer">
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                type="submit"
                            >
                                Post
                            </Button>
                        </div>

                    </form>
                </div>

            </CardContent >
        </Card >








    )
}

export default StatusModalsalle