import React, { useState, useContext } from 'react'
import { useHttpClient } from '../../shared/components/hooks/http-hook'
import { useHistory } from 'react-router-dom'

import AuthContext from "../../shared/components/context//auth-context"

import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import Modal from '../../shared/components/UIElements/Modal'
import Map from '../../shared/components/UIElements/Map'


import './PlaceItem.css'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'

/*
    Component of <li> </li> that displays info of a place, used in PlaceList
*/
const PlaceItem = (props) => {

    const history = useHistory();
    const auth = useContext(AuthContext)

    const { sendRequest, error, isLoading, clearError } = useHttpClient();

    const [showMap, setShowMap] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)


    const openMapHandler = () => {
        setShowMap(true)
    }

    const closeMapHandler = () => {
        setShowMap(false)
    }

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true)
    }

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false)
    }

    const confirmDeleteHandler = async () => {

        setShowConfirmModal(false)

        try {

            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            )

            props.onDelete(props.id);

            // redirect user to home page
            history.push(`/${auth.userId}/places`)

        } catch (error) {
            // errors handled in hook using send request
        }

    }



    return (

        <React.Fragment>

            {/* Modal uses React Portal to be rendered in a different place, instead of above listitem.  */}
            {/* Achieves same look but is better semantically  */}

            {/* Google Maps Modal */}
            <Modal
                show={showMap}
                // note, on cancel is passed to modal, then to backdrop, this oncancel closes map handler , other closed drawer
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler} > CLOSE </Button>}
            >

                {/* Whatever is here will be passed to props.children in modal */}
                <div className="map-container" >

                    <Map
                        center={props.coordinates}
                        zoom={14}
                    />

                </div>

            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showConfirmModal}
                header="Are you sure?"
                footerClass="place-item__modal-actionsc"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteHandler}> CANCEL </Button>
                        <Button danger onClick={confirmDeleteHandler}> DELETE </Button>
                    </React.Fragment>
                }
            >

                <p>Are you sure you want to delete this place? It can not be undone later...</p>

            </Modal>

            <ErrorModal error={error} onClear={clearError} />

            <li className='place-item'>

                <Card className='place-item__content'>

                    {isLoading && <LoadingSpinner asOverlay />}

                    <div className="place-item__image">
                        {/* TODO FIX THIS ENV PATH */}
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
                    </div>

                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>

                    <div className="place-item__actions">

                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>

                        {/* Only show buttons if user logged in is the user that made the place */}
                        {auth.userId === props.creatorId &&
                            <Button to={`/places/${props.id}`}>EDIT</Button>
                        }
                        {auth.userId === props.creatorId &&
                            <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}


                    </div>

                </Card>

            </li>

        </React.Fragment>

    )
}

export default PlaceItem;