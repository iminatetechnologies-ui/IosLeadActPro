import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Feather';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const AudioPlayer = ({ audioUrl }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const s = new Sound(audioUrl, null, (error) => {
      if (error) return;
      setSound(s);
      setDuration(s.getDuration());
    });

    return () => {
      s.release();
    };
  }, []);

  const playPause = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
    } else {
      sound.play(() => setIsPlaying(false));
      setIsPlaying(true);

      // Track progress
      sound.setVolume(1);
      const interval = setInterval(() => {
        sound.getCurrentTime((sec) => {
          setPosition(sec);
          if (sec >= duration) clearInterval(interval);
        });
      }, 500);
    }
  };

  const restart = () => {
    if (!sound) return;
    sound.setCurrentTime(0);
    setPosition(0);
    setIsPlaying(false);
  };

  const format = (sec) => {
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <View style={styles.container}>
      {/* PLAY / PAUSE */}
      <TouchableOpacity onPress={playPause} style={styles.playBtn}>
        <Icon 
          name={isPlaying ? 'pause' : 'play'} 
          size={15} 
          color="#000" 
        />
      </TouchableOpacity>

      {/* SEEK BAR */}
      <View style={styles.centerBox}>
        <Text style={styles.timeText}>{format(position)} / {format(duration)}</Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={(val) => sound?.setCurrentTime(val)}
        />
      </View>

      {/* RESTART BUTTON */}
      <TouchableOpacity onPress={restart} style={styles.restartBtn}>
        <Icon name="rotate-ccw" size={20} color="#000" />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(55.5),
    height: responsiveHeight(5),
    backgroundColor: '#F1F1F1',
    borderRadius: responsiveWidth(5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
    justifyContent: 'space-between',
  },
  playBtn: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    borderRadius: responsiveWidth(3),
    backgroundColor: '#e4e6e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restartBtn: {
    padding: responsiveWidth(0),
  },
  centerBox: {
    flex: 1,
    marginHorizontal: responsiveWidth(2),
  },
  timeText: {
    fontSize: responsiveFontSize(1.4),
    color: '#000',
    marginBottom: responsiveHeight(0.3),
    textAlign:'center'
  },
  slider: {
    width: '100%',
  },
});

export default AudioPlayer;
