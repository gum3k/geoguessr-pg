import NavigationComponent from '../components/theme/NavigationComponent';
import ContainerComponent from '../components/theme/ContainerComponent';
import ContentComponent from '../components/theme/ContentComponent';
import MainProfileComponent from '../components/theme/MainProfileComponent';
import { useState, useEffect } from 'react';

const ProfileView = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/profile-info', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const data = await response.json();
                setProfileData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
        fetchProfile();
    }, []);


    return (
        <ContainerComponent>
            <NavigationComponent/>
            <ContentComponent >
                <MainProfileComponent profileData={profileData} loading={loading} error={error}/>
            </ContentComponent>
        </ContainerComponent>
    )
};

export default ProfileView;