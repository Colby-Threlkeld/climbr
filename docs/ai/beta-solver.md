# AI: Beta solver (the "dots")

> Read this for steps 11 (body model), 23, and 30. Worker module: `worker/beta/` (`body_model.py`, `solver.py`). The body-proportion model must match `src/avatar/` in the app.

- **Scale:** pixels → centimeters, from the wall height (Route Reader step 4: location default ~430 cm + user slider) and the image geometry.
- **Body model:** a simple 2D stick figure built from height and wingspan, using standard body-segment proportions (arm, forearm, torso, thigh, shin lengths as fractions of height, with arm length adjusted by ape index).
- **Search:** each **state** = which hold each of the 4 limbs is on. Each **move** = one limb to a new hold. A move is allowed only if the body can reach it: limb lengths, plus constraints like hands above feet and center of mass over the base of support. Use **A\* / Dijkstra** from start to top, where move cost = reach strain + awkwardness + number of moves. Hold-type guesses adjust costs (crimps cost more to hang off).
- **Output:** the top 1–3 sequences ("Static", "Dynamic", "Short-climber friendly") as ordered lists of moves `{limb, from_hold, to_hold, pose, tip}` (decision C9), each with a **body pose** (joint positions) for the avatar.
- **Language:** the LLM turns each move into a short, human tip, given the move, the hold types, and the user's profile. It should say when the body matters ("At 5'4" with a +1 in ape index, this cross is out of reach, so match instead").
- **Latency target:** < 10 s.
- **Honest limitation:** a 2D photo can't see wall angle changes, volumes in depth, or hold friction. The assisted step, wording ("suggested"), and ratings all exist because of this.
