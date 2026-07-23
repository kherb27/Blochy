# Bloch sphere visualization

This small Javascript tool aims at providing a simple-to-use interface for visualizing quantum state evolutions on the Bloch sphere. The original intend was to replace the tyipical pens that one holds in the hand to follow a trajectory with an online tool that is available on every computer. Furthermore, it proved helpful in the teaching context when introducing students to spin dynamics. 

This tool is hosted at: https://bloch.kherb.io

Issues, wishes and pull-requests from the community are very welcome!

## Operation sequence view

Each applied operation (rotation, gate, or pulse) now gets a sequential number and a unique color:

- the trajectory of every operation is drawn on the sphere in its own color, with the sequence number tagged at the trajectory endpoint,
- hovering a trajectory shows the operation number and description (e.g. `#2: Rx(90°)`),
- an **Operation sequence** panel lists all applied operations as numbered, color-matched chips,
- undo/init keep numbering consistent,
- the feature can be toggled off in *Settings → Color-code operations* to recover the previous single-color history trace.
