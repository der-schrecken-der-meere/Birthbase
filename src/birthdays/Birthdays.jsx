import React, { useEffect, useState } from 'react'
import columns from "./columns.jsx"
import DataTable from "./DataTable.jsx"
import { birthdays } from "./birthdays.js";

const getData = async () => {
    console.log(birthdays);
    return birthdays;
} 

const Birthdays = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        (async () => {
            const data = await getData();
            setData(data);
        })()
    }, []);
    
    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default Birthdays