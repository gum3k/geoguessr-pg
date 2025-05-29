import { useRef, useEffect } from "react";

const PopupInputComponent = ({ title, placeholder, value, onChange, onConfirm, onCancel }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                onConfirm();
            } else if (e.key === "Escape") {
                onCancel();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onConfirm, onCancel]);

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <h3 style={styles.title}>{title}</h3>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    style={styles.input}
                />
                <div style={styles.buttons}>
                    <button style={styles.confirmButton} onClick={onConfirm}>Join</button>
                    <button style={styles.cancelButton} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    popup: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#1e1e2f',
        borderRadius: '12px',
        padding: '30px',
        textAlign: 'center',
        width: '300px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '6px',
        border: '1px solid #888',
        marginBottom: '20px',
        backgroundColor: '#333',
        color: '#fff',
        boxSizing: 'border-box',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        gap: '10px',
    },
    confirmButton: {
        flex: 1,
        padding: '10px 20px',
        backgroundColor: '#6a0dad',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    cancelButton: {
        flex: 1,
        padding: '10px 20px',
        backgroundColor: '#444',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
};

export default PopupInputComponent;
