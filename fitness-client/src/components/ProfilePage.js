
import React from 'react';
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
    const { user, isAdmin } = useAuth();

    return (
        <div>
            <h2>Profile</h2>
            {user ? (
                <>
                    <p>Username: {user.username}</p>
                    {isAdmin ? <p>You are an Admin</p> : <p>You are a regular user</p>}
                </>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
        </div>
    );
};

export default ProfilePage;
