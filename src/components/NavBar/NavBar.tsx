import React, { useState } from "react";
import styles from "./NavBar.module.css";
import UserIconDropdown from "../DropDown/UserIcondd";

type NavBarProps = {
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onLogout: () => void;
};

function NavBar({ onLoginClick, isLoggedIn, onLogout }: NavBarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropDownClick = () => setIsDropdownOpen((prev) => !prev);
    const handleDropdownClose = () => setIsDropdownOpen(false);

    const handleHomeClick = () => (window.location.href = "/");
    const handleMarketplaceClick = () => (window.location.href = "/marketplace");
    const handleDigitalArtsClick = () => (window.location.href = "/digitalatrs");

    return (
        <div className={styles.NavBar}>
            <img src="src/assets/images/pixoraLogo.png" className={styles.pixoraIcon} alt="Pixora Logo" />
            <div className={styles.NavBarButtons}>
                <div className={styles.NavButton} onClick={handleHomeClick}>Home</div>
                <div className={styles.NavButton} onClick={handleMarketplaceClick}>Marketplace</div>
                <div className={styles.NavButton}>Live Auctions</div>
                <div className={styles.NavButton} onClick={handleDigitalArtsClick}>Digital Arts</div>
                <div className={styles.NavButton}>Photographs</div>
            </div>
            {!isLoggedIn ? (
                <button className={styles.loginButton} onClick={onLoginClick}>
                    <div className={styles.textWrapper}>Login</div>
                </button>
            ) : (
                <div className={styles.profileContainer}>
                    <button className={styles.profileButton} onClick={handleDropDownClick}>
                        <img src="src/assets/images/User icon.png" className={styles.UserIcon} alt="Profile" />
                    </button>
                    {isDropdownOpen && (
                        <UserIconDropdown onClose={handleDropdownClose} onLogout={onLogout} />
                    )}
                </div>
            )}
        </div>
    );
}

export default NavBar;