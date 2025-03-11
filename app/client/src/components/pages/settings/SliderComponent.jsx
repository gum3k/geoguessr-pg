import React from 'react';

const SliderComponent = ({ min = 1, max = 10, step = 1, value, onChange, label = 'Value' }) => {
  const progress = ((value - min) / (max - min)) * 100; // Oblicz procentowy postęp

  const styles = {
    container: {
      margin: '20px 0',
      textAlign: 'center',
    },
    slider: {
      width: '80%',
      height: '12px',
      borderRadius: '5px',
      outline: 'none',
      appearance: 'none',
      cursor: 'pointer',
      background: `linear-gradient(90deg, 
rgb(2, 168, 2) 0%,      /* Zielony początek */
rgb(0, 67, 190) ${progress}%,  /* Niebieski środek (dynamiczny procent) */
        purple ${progress}%,   /* Fiolet od punktu suwaka */
        purple 100%)`,    /* Fiolet na końcu */
    },
    valueDisplay: {
      marginTop: '10px',
      fontSize: '20px',
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
        className="earth-slider"
      />
      <div style={styles.valueDisplay}>
        {label}
      </div>
    </div>
  );
};

export default SliderComponent;
