const ProfileInfoComponent = () => {
    const username = "Guest";
    const email = "eloelo@elo.elo";

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <div style={styles.profileImageWrapper}>
                    <img src="./earth.png" alt="profile" style={styles.image}></img>
                </div>
                <div style={styles.profileInfo}>
                    <h2 style={styles.username}>Username: {username}</h2>
                    <h2 style={styles.email}>E-mail: {email}</h2>
                    <h2 style={styles.country}>Country: Poland</h2>
                    <h3>Edit profile</h3>
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
        gridTemplateColumns: '1fr 1fr',
        gap: '0px'
    },
    image: {
        width: '10em',
        height: '10em',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #ccc',
    },

}

export default ProfileInfoComponent;
