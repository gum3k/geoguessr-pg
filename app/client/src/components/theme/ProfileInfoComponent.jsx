const ProfileInfoComponent = ({ profile }) => {
    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <div style={styles.profileImageWrapper}>
                    <img src="./earth.png" alt="profile" style={styles.image} />
                </div>
                <div style={styles.profileInfo}>
                    <h2 style={styles.text}>Username: {profile.username}</h2>
                    <h2 style={styles.text}>E-mail: {profile.email}</h2>
                    <button style={styles.edit}>Edit profile</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '20px',
        backgroundColor: 'rgb(90, 22, 134)',
        color: '#fff',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        gap: '20px',
    },
    profileImageWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '15em',
        height: '15em',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid rgb(8, 116, 32)'
    },
    profileInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '10px',
    },
    text: {
        fontFamily: 'Accuratist',
        fontSize: '32px',
    },
    edit: {
        fontSize: '20px',
        color: 'rgb(8, 116, 32)',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
};

export default ProfileInfoComponent;
