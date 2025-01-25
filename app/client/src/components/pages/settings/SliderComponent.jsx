import React from 'react';

const SliderComponent = ({ min = 1, max = 10, step = 1, value, onChange, label = 'Value' }) => {
  const styles = {
    container: {
      margin: '20px 0',
      textAlign: 'center',
    },
    slider: {
      width: '80%',
      height: '8px',
      background: 'linear-gradient(to right, violet, purple)',
      borderRadius: '5px',
      outline: 'none',
      appearance: 'none',
      cursor: 'pointer',
    },
    valueDisplay: {
      marginTop: '10px',
      fontSize: '18px',
      color: 'white',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={styles.slider}
      />
      <div style={styles.valueDisplay}>
        {label}
      </div>
    </div>
  );
};

export default SliderComponent;
