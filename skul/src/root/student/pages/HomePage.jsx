import { useContext, useEffect, useState } from "react";
import { UserContext } from '../../../contexts/UserContext'
import { StudentContext } from '../context/studentcontext'

const HomePage = () => {
    const { user } = useContext(UserContext);
    const { student } = useContext(StudentContext);

    return (
        <div>HomePage</div>
    )
}

export default HomePage