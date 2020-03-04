import React, { useRef, useState, useEffect } from 'react'

import Button from './Button'

import './ImageUpload.css'

const ImageUpload = props => {

    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState()
    const [isValid, setIsValid] = useState(false)

    // useRef to save value that survives rerender cycles and is connected to a dom element
    const filePickerRef = useRef()

    useEffect(() => {

        // if no file then don't do anything
        if (!file) {
            return;
        }

        // FileReader is bult into browser
        const fileReader = new FileReader();

        // function that excecutes after filereader loads new file or parses new file
        fileReader.onload = () => {

            // argument is the file passed to fileReader
            setPreviewUrl(fileReader.result);
        }

        fileReader.readAsDataURL(file);

    }
        , [file])

    // emulates click on file input to open file picker
    const pickImageHandler = () => {

        // click method available on dom node
        filePickerRef.current.click();

    }

    const pickedImageHandler = (event) => {

        let pickedFile;
        let fileIsValid = isValid

        // File inputs have files property with array of files submitted
        // Will only support one file at a time
        if (event.target.files && event.target.files.length === 1) {

            pickedFile = event.target.files[0];
            setFile(pickedFile)
            setIsValid(true)
            fileIsValid = true

        } else {

            setIsValid(false)
            fileIsValid = false

        }

        props.onInput(props.id, pickedFile, fileIsValid)

    }


    return (

        <div className="form-control">

            <input
                id={props.id}
                ref={filePickerRef} //connect useRef
                style={{ display: "none" }} // File picker will be invisible, but opened when pickImageHandler called
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={pickedImageHandler}

            />

            {/* Center written this way so simply writing "center" will return center class name  */}
            <div className={`image-upload ${props.center && 'center'}`}>

                <div className="image-upload__preview">

                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please provide an image</p>}

                </div>

                {/* Type button to prevent form submission behavior */}
                <Button type="button" onClick={pickImageHandler} >PICK IMAGE</Button>

            </div>

            {!isValid && <p>{props.errorText}</p>}

        </div>
    )

}

export default ImageUpload
