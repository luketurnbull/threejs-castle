# Castle on a Hill

Castle Project for ThreeJS Journey Challenge 18

# TODO/ Ideas list

## Loading screen and background sounds

- [x] Add basic loading screen and background sound
- [x] Think of loading screen concept that fits with concept/ colours themes, svg pictures?
- [x] Add way to toggle audio off
- [x] Add shadcn/ui so we can quickly add buttons
- [ ] Style buttons better
- [ ] Animate sound next to audio button to show it's on?
- [ ] Make sure audio loops properly

## Castle

- [x] Way less emissions coming from windows in Blender, looks too orange
- [x] Less area light, otherwise looking great!
- [x] Create door
- [ ] Add chains to door
- [ ] Door that lowers when you click on it

## Grass

- [x] Make grass strands different heights
- [ ] Fade grass sound out when users mouse leaves the hill
- [ ] Make hover over grass effect better, currently the grass warps too much

## Windows

- [x] Make windows all an instance mesh so we're using the same mesh and material
- [x] Make sure window normals are facing the correct way in Blender so we don't have to use THREE.DoubleSide
- [x] Add cool shader to the mesh, that looks like a flickering light

## Rocks

- [x] Add a bunch of rocks to the scene in Blender and rebake everything

## Flag

- [x] Add waving flag to the top of the castle

## Fire

- [x] Make a camp fire
- [x] Smoke shader during day
- [ ] Fire shader during night

## Night mode

- [x] Change the Sun settings
- [x] Add stars
- [x] Dim down the ambient light in the scene
- [ ] Show a moon in the Sky some how?
- [ ] Bake lighting for night time (moon light and more emission from castle windows?)
- [ ] Add transition

## Refinements

- [ ] Refine experience for mobile
- [ ] Potentially do adaptive performance? Less grass blades and no clouds if the users computer can't handle it?
- [ ] Play with some Post Processor effects?
- [ ] Use GSAP MorphSVG to morph the moon and sun SVGs in the mode toggle

## Tree

- [ ] Come up with a concept for a tree
