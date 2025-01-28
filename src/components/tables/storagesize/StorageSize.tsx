import React, { useEffect, useState } from "react";
import { columns, type StorageSize } from "./columns";
// import { DataTable } from "@/frontend/components/table_blueprint/DataTable";
// import { Button } from "@/frontend/components/ui/button";
// import { 
//     objIsEmpty, 
//     toSmallestByteType, 
//     Format,
//     getAllStorages
// } from "@/lib/main_util";
import { Decimal } from "decimal.js";

// const storages: StorageSize[] = [
//     {
//         name: "Lokaler Speicher",
//         size: "12MB",
//         raw: 12_000_000,
//         fn: () => null,
//     },
//     {
//         name: "Session Speicher",
//         size: "12kB",
//         raw: 12_000,
//         fn: () => null
//     }
// ]

const StorageSize = () => {
    // const [data, setData] = useState<StorageSize[]>([])
    // useEffect(() => {
    //     (async() => {
    //         try {
    //             setData(await getAllStorages());
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     })();
    // }, [])

    // console.log(data);

    // const [bytes, setBytes] = React.useState(Format.Byte("de", "byte", new Decimal(0)));
    // const [rowSelection, setRowSelection] = React.useState({});
    
    // useEffect(() => {
    //     let v = new Decimal(0);
    //     if (objIsEmpty(rowSelection)) {
    //         setBytes(Format.Byte("de", "byte", v));
    //         return;
    //     }
    //     for (const prop in rowSelection) {
    //         v = v.add(data[Number(prop)].raw)
    //     }
    //     console.log(v.toString());
    //     const formated = toSmallestByteType(v);
    //     setBytes(Format.Byte("de", formated.u, formated.v));
    // }, [rowSelection, data]);

    // const onClick = async () => {
    //     for (const prop in rowSelection) {
    //         await data[Number(prop)].fn();
    //     }
    // }

    return (
        <>
            <div></div>
            {/* <DataTable 
                columns={columns} 
                data={data} 
                selection={[rowSelection, setRowSelection as () => void]}
            />
            <Button onClick={onClick} disabled={objIsEmpty(rowSelection)}>{`${bytes}`} bereinigen</Button> */}
        </>
    )
}

export default StorageSize