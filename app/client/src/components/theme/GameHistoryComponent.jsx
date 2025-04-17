import React, {useState} from 'react';

const data = Array.from({ length: 100 }, (_, index) => `Item ${index + 1}`);

const GameHistoryComponent = ({ }) => {
    const itemsPerPage = 40;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const page = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <h1>Game History</h1>
                <div>
                    <ul>
                    {currentItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                    </ul>
                </div>

                <div>
                    <ul style={{ display: 'flex', listStyle: 'none' }}>
                    {pageNumbers.map((number) => (
                        <li key={number} style={{ margin: '0 5px' }}>
                        <button onClick={() => page(number)}>{number}</button>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    )
};

const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px',
      borderRadius: '20px',
      backgroundColor: 'rgb(90, 22, 134)',

    },
    wrapper: {
        display: 'grid',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0px'
    },
}

export default GameHistoryComponent;
