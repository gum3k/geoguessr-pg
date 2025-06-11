import { useState } from "react";
import { toast } from "react-toastify";
import BasicButtonComponent from "./BasicButtonComponent";

const ProfileInfoComponent = ({ profile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        username: profile.username,
        email: profile.email,
        password: '',
        newPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async () => {
        if (!selectedImage) return;

        if (selectedImage.size > 2 * 1024 * 1024) {
            toast.error('Image size must be under 2 MB');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const res = await fetch('http://localhost:3000/api/profile/upload-image', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            toast.success(data.message || 'Image uploaded successfully');
        } catch (err) {
            console.error('Upload error:', err);
            toast.error(err.message || 'Error uploading image');
        }
    };

    const handleSave = async () => {
        try {
            const profileRes = await fetch('http://localhost:3000/api/profile', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                }),
            });

            const profileData = await profileRes.json();
            if (!profileRes.ok) {
                throw new Error(profileData.message || 'Failed to update profile');
            }
            toast.success(profileData.message || 'Profile updated successfully');

            if (formData.password && formData.newPassword) {
                const passwordRes = await fetch('http://localhost:3000/api/profile/password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        currentPassword: formData.password,
                        newPassword: formData.newPassword,
                    }),
                });
                const passwordData = await passwordRes.json();
                if (!passwordRes.ok) {
                    throw new Error(passwordData.message || 'Failed to update password');
                }
                toast.success(passwordData.message || 'Password updated successfully');
            }
            setIsEditing(false);

            setTimeout(() => {
                window.location.reload();
            }, 800);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Something went wrong while updating profile');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <div style={styles.column}>
                    <div style={styles.profileImageWrapper}>
                        <img src="./earth.png" alt="profile" style={styles.image} />
                    </div>
                </div>
                <div style={styles.column}>
                    <div style={styles.profileInfo}>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Username"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Email"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Current Password"
                                />
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="New Password"
                                />
                                <button onClick={handleSave} style={styles.save}>Save</button>
                            </>
                        ) : (
                            <>
                                <h2 style={{ ...styles.text, marginBottom: '0px' }}>Username: {profile.username}</h2>
                                <h2 style={{ ...styles.text, marginTop: '0px' }}>E-mail: {profile.email}</h2>
                            </>
                        )}
                        <div style={styles.fileUploadWrapper}>
                            <input
                                type="file"
                                accept="image/*"
                                id="upload"
                                onChange={(e) => setSelectedImage(e.target.files[0])}
                                style={styles.hiddenFileInput}
                            />
                            <label htmlFor="upload" style={styles.customFileLabel}>
                                Choose file
                            </label>
                            <span style={styles.fileName}>
                                {selectedImage ? selectedImage.name : 'No file selected'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div style={styles.buttonsRow}>
                <BasicButtonComponent
                    style={styles.uploadButton}
                    onClick={handleImageUpload}
                    buttonText={"Upload image"}
                />
                <BasicButtonComponent
                    style={styles.edit}
                    onClick={() => setIsEditing(true)}
                    buttonText="Edit profile"
                />
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1em',
        borderRadius: '20px',
        backgroundColor: 'rgb(24, 53, 134)',
        color: '#fff',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '50px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    },
    profileImageWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '12em',
        height: '12em',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid rgb(8, 116, 32)',
        marginLeft: '1em'
    },
    profileInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '4px',
    },
    text: {
        fontFamily: 'Accuratist',
        fontSize: '32px',
        lineHeight: '1.1',
    },
    edit: {
        fontSize: '18px',
        color: '#fff',
        backgroundColor: 'rgb(8, 32, 116)',
        padding: '8px 16px',
        borderRadius: '10px',
        border: '1px solid rgb(8, 116, 32)',
        cursor: 'pointer',
        fontFamily: 'Accuratist',
    },
    save: {
        fontFamily: 'Accuratist',
        fontSize: '20px',
        color: '#fff',
        backgroundColor: 'rgb(8, 116, 32)',
        border: 'none',
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '10px',
    },
    input: {
        fontSize: '18px',
        padding: '10px',
        borderRadius: '8px',
        border: '2px solid rgb(8, 116, 32)',
        outline: 'none',
        backgroundColor: 'rgb(51, 3, 76)',
        color: 'white',
        fontFamily: 'Accuratist',
    },
    uploadButton: {
        fontSize: '18px',
        color: '#fff',
        backgroundColor: 'rgb(8, 32, 116)',
        padding: '8px 16px',
        borderRadius: '10px',
        border: '1px solid rgb(8, 116, 32)',
        cursor: 'pointer',
        fontFamily: 'Accuratist',
    },
    fileUploadWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        color: 'white',
        marginTop: '6px'
    },
    hiddenFileInput: {
        display: 'none',
    },
    customFileLabel: {
        padding: '8px 16px',
        backgroundColor: 'rgb(8, 116, 32)',
        color: '#fff',
        borderRadius: '10px',
        cursor: 'pointer',
        fontFamily: 'Accuratist',
        fontSize: '16px',
        border: '1px solid rgb(8, 116, 32)',
    },
    fileName: {
        fontSize: '14px',
        fontFamily: 'Accuratist',
        color: '#fff',
    },
    buttonsRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
    },
};

export default ProfileInfoComponent;