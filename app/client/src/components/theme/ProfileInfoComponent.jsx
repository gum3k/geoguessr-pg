const ProfileInfoComponent = ({profile}) => {

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <div style={styles.profileImageWrapper}>
                    <img src="./earth.png" alt="profile" style={styles.image}></img>
                </div>
                <div style={styles.profileInfo}>
                    <h2>Username: {profile.username}</h2>
                    <h2>E-mail: {profile.email}</h2>
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
