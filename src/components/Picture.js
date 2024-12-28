import React from 'react';
import { Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types'; // Add prop validation

const styles = StyleSheet.create({
  image: {
    width: 152,
    height: 152,
    borderRadius: 152 / 2,
    resizeMode: 'contain',
  },
});

const Picture = ({ source }) => {
  return <Image style={styles.image} source={source} />;
};

// Prop validation
Picture.propTypes = {
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
    .isRequired,
};

export default Picture;
