# Castle on a Hill

Castle Project for ThreeJS Journey Challenge 18

# TODO/ Ideas list

## Styling buttons

There are three buttons:

- Start
- Audio
- Day/Night Mode

I want to make the buttons look more castle themed.
I want to use the same style for all three buttons.

GSAP MorphSVG to morph the moon and sun SVGs in the mode toggle, and also change the mood of the buttons depending on the mode. Maybe orange and yellow for day, and blue and purple for night.

I would like when the audio button is clicked, the sound icon should animate to show it's on with musical notes.

I would like to add sounds and cool hover effect/ click effect to the buttons.

# Audio

Different audio for day and night.

Audio for fire, when the camera is close to the fire, make it louder.

## Compressing images / Performance optimizations

I compressed the images with the following command:

```
basisu -file input.png -ktx2 -uastc -uastc_level 2 -linear -resample-factor .5
```

```
-resample-factor .5
```
