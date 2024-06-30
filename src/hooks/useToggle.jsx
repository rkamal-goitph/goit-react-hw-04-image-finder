import { useState } from "react";

export const useToggle = () => {
    //declare reusable state
 
    const [showModal, setShowModal] = useState(false);
    //declare reusable modifier
 
    const toggle = () => setShowModal(!showModal);
    //return reusable values as one object
 
    return { showModal, toggle };
 };