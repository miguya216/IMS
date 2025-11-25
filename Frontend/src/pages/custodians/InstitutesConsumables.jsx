import TableControls from "../../components/TableControls";
import { useEffect, useState } from "react";

const InstitutesConsumables = () => {
    const [rows, setRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("/api/Consumable-Handlers/get_unit_consumables.php")
            .then(res => res.json())
            .then(data => setRows(data))
            .catch(err => console.error(err));
    }, []);

    // FILTER rows based on search query
    const filteredRows = rows.filter(row =>
        row.transaction_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.consumable_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <TableControls
                title="Consumables Tracking"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Search consumable or transaction..."
                searchInputTitle="Search by consumable or transaction no."
            />

            <div className="custom-table-wrapper mt-4">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Transaction No.</th>
                            <th>Consumable Name</th>
                            <th>Date Consumed</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRows.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                    No matching records found
                                </td>
                            </tr>
                        ) : (
                            filteredRows.map((row, index) => (
                                <tr key={index}>
                                    <td data-label="Transaction No.">{row.transaction_no}</td>
                                    <td data-label="Consumable Name">{row.consumable_name}</td>
                                    <td data-label="Date Consumed">{new Date(row.date_consumed).toLocaleDateString()}</td>
                                    <td data-label="Quantity"><b>{row.quantity}</b></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default InstitutesConsumables;
