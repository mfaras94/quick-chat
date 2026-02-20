const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

const useKeyboardSounds = () => {
  const playRandomKeyStrokeSound = () => {
    const randomSounds = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];
    randomSounds.currentTime = 0;
    randomSounds
      .play()
      .catch((error) => console.log("Audio playing Faild", error));
  };

  return playRandomKeyStrokeSound
};

export default useKeyboardSounds;
