import React, { useState } from 'react';
import NavigationComponent from '../components/theme/NavigationComponent';
import ContainerComponent from '../components/theme/ContainerComponent';
import ContentComponent from '../components/theme/ContentComponent';
import MainProfileComponent from '../components/theme/MainProfileComponent';

const ProfileView = () => {

    return (
        <ContainerComponent>
            <NavigationComponent/>
            <ContentComponent >
                <MainProfileComponent></MainProfileComponent>
            </ContentComponent>
        </ContainerComponent>
    )
};

export default ProfileView;