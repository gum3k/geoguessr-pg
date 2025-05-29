const StatsComponent = ({ stats }) => {
    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <h1 style={styles.heading}>Stats</h1>
                <div style={styles.row}>
                    <div style={styles.statBox}>
                        <div style={styles.statContent}>
                            <span style={styles.label}>Average points per guess</span>
                            <span style={styles.value}>{stats.avgpointsperguess}</span>
                        </div>
                    </div>
                    <div style={styles.statBox}>
                        <div style={styles.statContent}>
                            <span style={styles.label}>Games played</span>
                            <span style={styles.value}>{stats.totalgames}</span>
                        </div>
                    </div>
                </div>
                <div style={{ ...styles.row, justifyContent: 'center' }}>
                    <div style={styles.statBox}>
                        <div style={styles.statContent}>
                            <span style={styles.label}>Most played map</span>
                            <span style={styles.value}>{stats.mostplayedmap}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '20px',
        backgroundColor: 'rgb(90, 22, 134)',
        color: '#fff',
        width: '100%',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
        width: '100%',
        maxWidth: '900px',
    },
    heading: {
        fontFamily: 'Accuratist',
        fontSize: '40px',
        color: 'rgb(255, 255, 255)',
        marginBottom: '20px',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        gap: '20px',
        width: '100%',
    },
    statBox: {
        backgroundColor: 'rgb(8, 13, 80)',
        borderRadius: '12px',
        padding: '16px 24px',
        minWidth: '200px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: 'rgb(255, 255, 255)',
        marginBottom: '6px',
    },
    value: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'rgb(126, 196, 117)',
    },
};

export default StatsComponent;
