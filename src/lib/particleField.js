export const FORMS = [
  "circle",
  "tree",
];

export const OPENING_DURATION = 6.3;

const FLOOR = -1.22;
const TAU = Math.PI * 2;

const TRUNK_END = 0.12;
const BRANCH_END = 0.25;
const TWIG_END = 0.34;

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

const mix = (a, b, t) =>
  a + (b - a) * t;

const smooth = (a, b, value) => {
  const t = clamp(
    (value - a) /
      Math.max(0.0001, b - a),
    0,
    1
  );

  return t * t * (3 - 2 * t);
};

function randomGenerator(seed = 48291) {
  return () => {
    seed =
      (seed * 1664525 +
        1013904223) >>>
      0;

    return seed / 4294967296;
  };
}

function quadraticPoint(a, b, c, t) {
  const mt = 1 - t;

  return (
    mt * mt * a +
    2 * mt * t * b +
    t * t * c
  );
}

function pointOnArchBranch(
  branch,
  t
) {
  return [
    quadraticPoint(
      branch.start[0],
      branch.control[0],
      branch.end[0],
      t
    ),

    quadraticPoint(
      branch.start[1],
      branch.control[1],
      branch.end[1],
      t
    ),

    quadraticPoint(
      branch.start[2],
      branch.control[2],
      branch.end[2],
      t
    ),
  ];
}

function makeBranches(random) {
  const branches = [];
  const count = 24;

  for (
    let i = 0;
    i < count;
    i++
  ) {
    const angle =
      i * 2.399963 +
      (random() - 0.5) * 0.28;

    const length =
      1.0 +
      random() * 0.72;

    const startY =
      -0.18 +
      random() * 0.44;

    const endY =
      0.2 +
      random() * 0.43;

    const spreadX =
      Math.cos(angle) *
      length *
      1.3;

    const spreadZ =
      Math.sin(angle) *
      length *
      0.68;

    const archHeight =
      0.44 +
      random() * 0.28;

    const droop =
      0.08 +
      random() * 0.13;

    const start = [
      (random() - 0.5) * 0.1,
      startY,
      (random() - 0.5) * 0.08,
    ];

    const control = [
      spreadX * 0.5,

      Math.max(
        startY,
        endY
      ) + archHeight,

      spreadZ * 0.46,
    ];

    const end = [
      spreadX,
      endY - droop,
      spreadZ,
    ];

    branches.push({
      start,
      control,
      end,
    });
  }

  return branches;
}

function makeTwigs(
  branches,
  random
) {
  const twigs = [];

  for (
    const branch of branches
  ) {
    for (
      let j = 0;
      j < 8;
      j++
    ) {
      const t =
        0.36 +
        j * 0.07 +
        random() * 0.03;

      const start =
        pointOnArchBranch(
          branch,
          Math.min(t, 0.95)
        );

      const angle =
        Math.atan2(
          branch.end[2] -
            branch.start[2],

          branch.end[0] -
            branch.start[0]
        ) +
        (random() - 0.5) *
          1.25;

      const reach =
        0.2 +
        random() * 0.28;

      const drop =
        0.1 +
        random() * 0.18;

      twigs.push({
        start,

        end: [
          start[0] +
            Math.cos(angle) *
              reach,

          start[1] +
            0.06 +
            random() * 0.12 -
            drop,

          start[2] +
            Math.sin(angle) *
              reach *
              0.72,
        ],
      });
    }
  }

  return twigs;
}

function makeForms(count) {
  const random =
    randomGenerator();

  const forms = {
    circle:
      new Float32Array(
        count * 3
      ),

    cluster:
      new Float32Array(
        count * 3
      ),

    canopy:
      new Float32Array(
        count * 3
      ),

    tree:
      new Float32Array(
        count * 3
      ),
  };

  const branches =
    makeBranches(random);

  const twigs =
    makeTwigs(
      branches,
      random
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {
    const n = i * 3;

    /*
    ============================
    CIRCLE
    ============================
    */

    const circleAngle =
      random() * TAU;

    const circleRadius =
      Math.sqrt(random()) * 0.9;

    forms.circle[n] =
      Math.cos(circleAngle) *
      circleRadius;

    forms.circle[n + 1] =
      0.5 +
      Math.sin(circleAngle) *
        circleRadius;

    forms.circle[n + 2] = 0;

    forms.cluster[n] =
      forms.circle[n] * 0.24;

    forms.cluster[n + 1] =
      0.53 +
      (forms.circle[n + 1] -
        0.5) *
        0.2;

    forms.cluster[n + 2] = 0;

    /*
    ============================
    SAKURA BLOSSOMS
    ============================
    */

    const twig =
      twigs[
        i % twigs.length
      ];

    const anchorT =
      0.56 +
      random() * 0.44;

    const anchor = [
      mix(
        twig.start[0],
        twig.end[0],
        anchorT
      ),

      mix(
        twig.start[1],
        twig.end[1],
        anchorT
      ),

      mix(
        twig.start[2],
        twig.end[2],
        anchorT
      ),
    ];

    const a =
      random() * TAU;

    const vertical =
      random() * 2 - 1;

    const radius =
      Math.cbrt(random());

    const belt =
      Math.sqrt(
        Math.max(
          0,
          1 -
            vertical *
              vertical
        )
      );

    const blossomX =
      0.28 +
      random() * 0.16;

    const blossomY =
      0.18 +
      random() * 0.09;

    const blossomZ =
      0.24 +
      random() * 0.11;

    const blossom = [
      anchor[0] +
        Math.cos(a) *
          belt *
          radius *
          blossomX,

      anchor[1] +
        vertical *
          radius *
          blossomY,

      anchor[2] +
        Math.sin(a) *
          belt *
          radius *
          blossomZ,
    ];

    /*
    Wide Japanese sakura canopy.
    */

    blossom[0] *= 1.28;
    blossom[2] *= 1.05;

    blossom[1] -= 0.065;

    const canopyEdge =
      clamp(
        Math.abs(blossom[0]) /
          1.85,
        0,
        1
      );

    blossom[1] +=
      (1 - canopyEdge) *
      0.15;

    blossom[1] -=
      canopyEdge *
      canopyEdge *
      0.2;

    blossom[1] +=
      Math.sin(
        blossom[0] * 4.1
      ) * 0.035;

    blossom[1] +=
      Math.sin(
        blossom[0] * 7.3 +
          blossom[2] * 2
      ) * 0.018;

    if (
      random() < 0.38
    ) {
      const hangingAmount =
        0.04 +
        random() * 0.15;

      blossom[1] -=
        hangingAmount *
        (0.45 +
          canopyEdge * 0.85);
    }

    forms.canopy.set(
      blossom,
      n
    );

    /*
    ============================
    FINAL TREE
    ============================
    */

    const ratio =
      i / count;

    let point;

    /*
    ============================
    TRUNK
    ============================

    Shape now behaves like:

               ||
               ||
               ||
              /  \
             /    \
           _/      \_
       ___/          \___

    Most of the trunk stays
    narrow.

    Only the lowest ~28%
    begins spreading outward.
    */

    if (
      ratio <
      TRUNK_END
    ) {
      const t =
        random();

      /*
      t = 0 -> ground
      t = 1 -> top of trunk
      */

      const angle =
        random() * TAU;

      /*
      Bottom 28% of trunk
      becomes the root flare.
      */

      const FLARE_HEIGHT =
        0.28;

      if (
        t <
        FLARE_HEIGHT
      ) {
        /*
        =========================
        LOWER ROOT FLARE
        =========================

        u:
        0 = outer root tip
        1 = where root reconnects
            with normal trunk
        */

        const u =
          clamp(
            t /
              FLARE_HEIGHT,
            0,
            1
          );

        /*
        LEFT or RIGHT side.
        */

        const side =
          random() < 0.5
            ? -1
            : 1;

        /*
        Roots take a lot of
        horizontal space, but only
        once they are near ground.
        */

        const ROOT_REACH =
          0.86;

        /*
        Near the trunk:
        horizontal growth starts
        very slowly.

        Near the ground:
        it spreads far outward.

        The 1.65 power keeps the
        upper transition vertical.
        */

        const outward =
          Math.pow(
            1 - u,
            1.65
          );

        let centerX =
          side *
          ROOT_REACH *
          outward;

        /*
        Rounded S-like bend.
        */

        centerX +=
          side *
          Math.sin(
            outward *
              Math.PI
          ) *
          0.07;

        /*
        At the trunk join:
        we're still high.

        Moving outward:
        root drops toward floor.

        The outer part becomes
        almost horizontal.
        */

        const centerY =
          FLOOR +
          0.045 +
          Math.pow(
            u,
            0.68
          ) *
            0.47;

        /*
        Thickness is larger where
        root joins trunk and gently
        tapers toward outer end.
        */

        const thickness =
          mix(
            0.038,
            0.16,
            Math.pow(
              u,
              0.7
            )
          );

        /*
        Bark ridges.
        */

        const ridge =
          Math.sin(
            angle * 4 +
              u * 7
          ) *
            0.013 +
          Math.sin(
            angle * 7 -
              u * 5
          ) *
            0.007;

        /*
        Roots become flatter
        as they approach ground.
        */

        const verticalThickness =
          thickness *
          mix(
            0.3,
            0.8,
            u
          );

        point = [
          centerX +
            Math.cos(angle) *
              (thickness +
                ridge),

          centerY +
            Math.sin(angle) *
              verticalThickness,

          Math.sin(angle) *
            thickness *
            0.62,
        ];

        /*
        Some particles remain
        through the middle so
        the base stays filled.
        */

        if (
          random() < 0.18
        ) {
          const centerRadius =
            0.07 +
            u * 0.07;

          point = [
            Math.cos(angle) *
              centerRadius,

            centerY,

            Math.sin(angle) *
              centerRadius *
              0.65,
          ];
        }
      }

      /*
      =========================
      NORMAL TRUNK
      =========================
      */

      else {
        /*
        Remap upper trunk into
        0 -> 1.
        */

        const upperT =
          (t -
            FLARE_HEIGHT) /
          (1 -
            FLARE_HEIGHT);

        /*
        Thickest near bottom,
        gradually thinner upward.
        */

        const baseRadius =
          mix(
            0.14,
            0.065,
            Math.pow(
              upperT,
              0.75
            )
          );

        /*
        Gentle trunk curve.
        */

        const centerX =
          Math.sin(
            upperT * 1.7 +
              0.25
          ) *
            0.052 +
          Math.sin(
            upperT * 3.3
          ) *
            0.014;

        const centerZ =
          Math.sin(
            upperT * 1.35 +
              1.0
          ) *
          0.023;

        /*
        Starts exactly around
        where root flare ends.
        */

        const y =
          mix(
            FLOOR + 0.51,
            FLOOR + 1.72,
            upperT
          );

        /*
        Bark ridges / irregularity.
        */

        const ridge =
          Math.sin(
            angle * 3 +
              upperT * 5
          ) *
            0.015 +
          Math.sin(
            angle * 6 -
              upperT * 3
          ) *
            0.008;

        const trunkRadius =
          baseRadius +
          ridge;

        point = [
          centerX +
            Math.cos(angle) *
              trunkRadius,

          y +
            Math.sin(
              angle * 2 +
                upperT * 4
            ) *
              0.01,

          centerZ +
            Math.sin(angle) *
              trunkRadius *
              0.75,
        ];
      }
    }

    /*
    ============================
    MAIN SAKURA BRANCHES
    ============================
    */

    else if (
      ratio <
      BRANCH_END
    ) {
      const branch =
        branches[
          i %
            branches.length
        ];

      const t =
        Math.pow(
          random(),
          0.78
        );

      point =
        pointOnArchBranch(
          branch,
          t
        );

      const thickness =
        0.018 +
        (1 - t) * 0.07;

      point[0] +=
        (random() - 0.5) *
        thickness;

      point[1] +=
        (random() - 0.5) *
        thickness *
        0.46;

      point[2] +=
        (random() - 0.5) *
        thickness;
    }

    /*
    ============================
    SMALL BRANCHES
    ============================
    */

    else if (
      ratio <
      TWIG_END
    ) {
      const activeTwig =
        twigs[
          i %
            twigs.length
        ];

      const t =
        random();

      point = [
        mix(
          activeTwig.start[0],
          activeTwig.end[0],
          t
        ) +
          (random() - 0.5) *
            0.02,

        mix(
          activeTwig.start[1],
          activeTwig.end[1],
          t
        ) +
          (random() - 0.5) *
            0.02,

        mix(
          activeTwig.start[2],
          activeTwig.end[2],
          t
        ) +
          (random() - 0.5) *
            0.02,
      ];
    }

    /*
    ============================
    BLOSSOMS
    ============================
    */

    else {
      point =
        blossom;
    }

    forms.tree.set(
      point,
      n
    );
  }

  return forms;
}

export class ParticleField {
  constructor(
    canvas,
    {
      count = 18000,
    } = {}
  ) {
    this.canvas =
      canvas;

    this.ctx =
      canvas.getContext(
        "2d"
      );

    this.count =
      count;

    this.forms =
      makeForms(count);

    this.shape =
      "tree";

    this.positions =
      new Float32Array(
        this.forms.tree
      );

    this.velocity =
      new Float32Array(
        count * 3
      );

    this.target =
      new Float32Array(
        count * 3
      );

    this.width = 1;
    this.height = 1;
    this.unit = 1;

    this.time = 0;
    this.yaw = 0;

    this.openingTime =
      null;

    this.ripples = [];

    const random =
      randomGenerator(
        9001
      );

    this.stars =
      Array.from(
        {
          length: 90,
        },

        () => [
          random(),
          random(),

          0.06 +
            random() * 0.22,
        ]
      );
  }

  resize(
    width,
    height,
    dpr = 1
  ) {
    this.width =
      width;

    this.height =
      height;

    this.unit =
      Math.min(
        width *
          (width < 700
            ? 0.265
            : 0.295),

        height *
          (width < 700
            ? 0.205
            : 0.225)
      );

    this.canvas.width =
      Math.round(
        width * dpr
      );

    this.canvas.height =
      Math.round(
        height * dpr
      );

    this.ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );
  }

  startOpening() {
    this.shape =
      "circle";

    this.openingTime = 0;

    this.velocity.fill(0);

    for (
      let i = 0;
      i < this.count;
      i++
    ) {
      const n = i * 3;

      this.positions[n] =
        this.forms.circle[n] *
        0.025;

      this.positions[n + 1] =
        0.5 +
        (this.forms.circle[
          n + 1
        ] -
          0.5) *
          0.025;

      this.positions[n + 2] =
        0;
    }
  }

  setShape(
    shape,
    instant = false
  ) {
    if (
      !FORMS.includes(
        shape
      )
    ) {
      return;
    }

    this.shape =
      shape;

    this.openingTime =
      null;

    if (instant) {
      this.positions.set(
        this.forms[
          shape
        ]
      );

      this.velocity.fill(
        0
      );
    }
  }

  openingTarget(time) {
    const {
      circle,
      canopy,
      tree,
    } = this.forms;

    const pop =
      smooth(
        0,
        0.7,
        time
      ) +
      Math.sin(
        smooth(
          0,
          0.92,
          time
        ) *
          Math.PI
      ) *
        0.065;

    const canopyMorph =
      smooth(
        0.92,
        3.15,
        time
      );

    for (
      let i = 0;
      i < this.count;
      i++
    ) {
      const n = i * 3;

      const normalizedHeight =
        clamp(
          (1.4 -
            tree[
              n + 1
            ]) /
            (1.4 -
              FLOOR),

          0,
          1
        );

      const delay =
        normalizedHeight *
        1.15;

      const treeFlow =
        smooth(
          3.0 + delay,

          4.45 + delay,

          time
        );

      for (
        let axis = 0;
        axis < 3;
        axis++
      ) {
        const center =
          axis === 1
            ? 0.5
            : 0;

        const expanded =
          center +
          (circle[
            n + axis
          ] -
            center) *
            pop;

        const leafyShape =
          mix(
            expanded,

            canopy[
              n + axis
            ],

            canopyMorph
          );

        this.target[
          n + axis
        ] =
          mix(
            leafyShape,

            tree[
              n + axis
            ],

            treeFlow
          );
      }
    }

    return this.target;
  }

  project(
    x,
    y,
    z
  ) {
    const rx = x;
    const rz = z;

    const tiltCos =
      0.975;

    const tiltSin =
      0.222;

    const depth =
      rz * tiltCos -
      y * tiltSin;

    const perspective =
      5.8 /
      Math.max(
        1.2,
        5.8 + depth
      );

    const scale =
      this.unit *
      perspective;

    return {
      x:
        this.width *
          0.5 +
        rx * scale,

      y:
        this.height *
          0.49 -
        (y * tiltCos +
          rz *
            tiltSin) *
          scale,

      scale,
      depth,
    };
  }

  ripple() {
    this.ripples.push({
      born: this.time,
    });

    if (
      this.ripples.length >
      4
    ) {
      this.ripples.shift();
    }
  }

  step(
    seconds,
    pointer = null
  ) {
    const elapsed =
      clamp(
        seconds,
        0,
        1 / 30
      );

    const dt =
      elapsed * 60;

    this.time += elapsed;

    let completed = false;
    let target;

    if (
      this.openingTime !==
      null
    ) {
      this.openingTime +=
        elapsed;

      target =
        this.openingTarget(
          this.openingTime
        );

      if (
        this.openingTime >=
        OPENING_DURATION
      ) {
        this.openingTime =
          null;

        this.shape =
          "tree";

        completed =
          true;
      }
    } else {
      target =
        this.forms[
          this.shape
        ];
    }

    const p =
      this.positions;

    const v =
      this.velocity;

    const cursorRadius =
      this.width < 700
        ? 23
        : 30;

    for (
      let i = 0;
      i < this.count;
      i++
    ) {
      const n = i * 3;

      const drift =
        Math.sin(
          this.time * 0.65 +
            i * 0.137
        ) * 0.0032;

      v[n] +=
        (target[n] +
          drift -
          p[n]) *
        0.036 *
        dt;

      v[n + 1] +=
        (target[n + 1] +
          drift * 0.3 -
          p[n + 1]) *
        0.036 *
        dt;

      v[n + 2] +=
        (target[n + 2] -
          drift * 0.4 -
          p[n + 2]) *
        0.036 *
        dt;

      if (
        pointer?.active
      ) {
        const projected =
          this.project(
            p[n],
            p[n + 1],
            p[n + 2]
          );

        const dx =
          projected.x -
          pointer.x;

        const dy =
          projected.y -
          pointer.y;

        const distance =
          Math.hypot(
            dx,
            dy
          );

        if (
          distance <
          cursorRadius
        ) {
          const safeDistance =
            Math.max(
              distance,
              1
            );

          const force =
            Math.pow(
              1 -
                distance /
                  cursorRadius,
              2.2
            ) *
            0.055 *
            dt;

          v[n] +=
            (dx /
              safeDistance) *
            force;

          v[n + 1] -=
            (dy /
              safeDistance) *
            force;

          v[n + 2] +=
            (dx /
              safeDistance) *
            force *
            0.18;
        }
      }

      const damping =
        Math.pow(
          0.84,
          dt
        );

      v[n] *= damping;
      v[n + 1] *= damping;
      v[n + 2] *= damping;

      p[n] +=
        v[n] * dt;

      p[n + 1] +=
        v[n + 1] * dt;

      p[n + 2] +=
        v[n + 2] * dt;
    }

    this.ripples =
      this.ripples.filter(
        (ripple) =>
          this.time -
            ripple.born <
          4.6
      );

    return completed;
  }

  drawPerspectiveOval(
    radiusWorld,
    alpha,
    phase = 0
  ) {
    const ctx =
      this.ctx;

    const root =
      this.project(
        0,
        FLOOR,
        0
      );

    const baseRadius =
      radiusWorld *
      this.unit *
      0.9;

    if (
      baseRadius < 2
    ) {
      return;
    }

    const rx =
      baseRadius;

    const ry =
      baseRadius * 0.17;

    const centerY =
      root.y +
      baseRadius * 0.045;

    const layers = [
      {
        offset: -3,
        width: 7,
        opacity: 0.06,
      },

      {
        offset: 0,
        width: 3.2,
        opacity: 0.2,
      },

      {
        offset: 2.5,
        width: 1.25,
        opacity: 0.54,
      },
    ];

    const drawHalf = (
      start,
      end,
      near,
      layer
    ) => {
      ctx.beginPath();

      const segments =
        72;

      for (
        let i = 0;
        i <= segments;
        i++
      ) {
        const angle =
          mix(
            start,
            end,
            i / segments
          );

        const sin =
          Math.sin(angle);

        const cos =
          Math.cos(angle);

        const horizontalWave =
          Math.sin(
            angle * 5 +
              this.time *
                1.15 +
              phase
          ) * 1.8;

        const verticalWave =
          Math.sin(
            angle * 4 -
              this.time *
                1.5 +
              phase
          ) *
            2.1 +
          Math.sin(
            angle * 9 +
              this.time *
                0.85
          ) *
            0.8;

        const x =
          root.x +
          cos *
            (rx +
              layer.offset +
              horizontalWave);

        const y =
          centerY +
          sin *
            (ry +
              layer.offset *
                0.18) +
          verticalWave;

        if (
          i === 0
        ) {
          ctx.moveTo(
            x,
            y
          );
        } else {
          ctx.lineTo(
            x,
            y
          );
        }
      }

      const sideOpacity =
        near
          ? 1
          : 0.36;

      ctx.strokeStyle =
        `rgba(
          255,
          154,
          208,
          ${
            alpha *
            layer.opacity *
            sideOpacity
          }
        )`;

      ctx.lineWidth =
        layer.width *
        (near
          ? 1
          : 0.62);

      ctx.shadowColor =
        "rgba(255,167,214,0.5)";

      ctx.shadowBlur =
        near
          ? 5
          : 2;

      ctx.stroke();
    };

    for (
      const layer of
      layers
    ) {
      drawHalf(
        Math.PI,
        TAU,
        false,
        layer
      );

      drawHalf(
        0,
        Math.PI,
        true,
        layer
      );
    }

    ctx.shadowBlur = 0;
  }

  drawFloorWaves() {
    const ctx =
      this.ctx;

    const root =
      this.project(
        0,
        FLOOR,
        0
      );

    ctx.beginPath();

    ctx.ellipse(
      root.x,
      root.y + 1,

      this.unit *
        0.12,

      this.unit *
        0.025,

      0,
      0,
      TAU
    );

    ctx.fillStyle =
      "rgba(255,166,213,0.12)";

    ctx.fill();

    const ambientCount =
      7;

    for (
      let i = 0;
      i <
      ambientCount;
      i++
    ) {
      const radius =
        (this.time *
          0.2 +
          i * 0.72) %
        5.2;

      const fadeIn =
        smooth(
          0,
          0.34,
          radius
        );

      const fadeOut =
        Math.pow(
          Math.max(
            0,
            1 -
              radius /
                5.2
          ),
          1.3
        );

      const pulse =
        0.8 +
        Math.sin(
          this.time *
            0.55 +
            i * 0.75
        ) * 0.12;

      this.drawPerspectiveOval(
        radius,

        fadeIn *
          fadeOut *
          pulse,

        i * 0.7
      );
    }

    for (
      const ripple of
      this.ripples
    ) {
      const age =
        this.time -
        ripple.born;

      const radius =
        age * 1.2;

      const alpha =
        Math.max(
          0,
          1 -
            age / 4.6
        );

      this.drawPerspectiveOval(
        radius,
        alpha,
        age * 1.5
      );
    }
  }

  draw() {
    const ctx =
      this.ctx;

    const w =
      this.width;

    const h =
      this.height;

    ctx.globalCompositeOperation =
      "source-over";

    ctx.globalAlpha = 1;

    ctx.fillStyle =
      "#07050d";

    ctx.fillRect(
      0,
      0,
      w,
      h
    );

    const haze =
      ctx.createRadialGradient(
        w * 0.5,
        h * 0.42,
        10,

        w * 0.5,
        h * 0.43,

        Math.min(
          w,
          h
        ) * 0.64
      );

    haze.addColorStop(
      0,
      "rgba(160,78,132,0.18)"
    );

    haze.addColorStop(
      0.5,
      "rgba(80,36,78,0.08)"
    );

    haze.addColorStop(
      1,
      "rgba(7,5,13,0)"
    );

    ctx.fillStyle =
      haze;

    ctx.fillRect(
      0,
      0,
      w,
      h
    );

    for (
      const [
        x,
        y,
        alpha,
      ] of this.stars
    ) {
      ctx.fillStyle =
        `rgba(
          255,
          229,
          239,
          ${alpha}
        )`;

      ctx.fillRect(
        x * w,
        y * h,
        0.8,
        0.8
      );
    }

    ctx.globalCompositeOperation =
      "lighter";

    this.drawFloorWaves();

    const p =
      this.positions;

    const woodyCount =
      Math.floor(
        this.count *
          TWIG_END
      );

    /*
    ============================
    WOOD
    ============================
    */

    ctx.beginPath();

    for (
      let i = 0;
      i <
      woodyCount;
      i++
    ) {
      const n =
        i * 3;

      const projected =
        this.project(
          p[n],
          p[n + 1],
          p[n + 2]
        );

      const size =
        clamp(
          projected.scale /
            145,
          0.86,
          1.42
        );

      ctx.rect(
        projected.x,
        projected.y,
        size,
        size
      );
    }

    ctx.fillStyle =
      "rgba(112,67,88,0.84)";

    ctx.fill();

    /*
    Wood ridge highlights.
    */

    ctx.beginPath();

    for (
      let i = 0;
      i <
      woodyCount;
      i += 7
    ) {
      const n =
        i * 3;

      const projected =
        this.project(
          p[n],
          p[n + 1],
          p[n + 2]
        );

      ctx.rect(
        projected.x,
        projected.y,
        1.12,
        1.12
      );
    }

    ctx.fillStyle =
      "rgba(156,104,124,0.34)";

    ctx.fill();

    /*
    ============================
    BLOSSOMS
    ============================
    */

    ctx.beginPath();

    for (
      let i =
        woodyCount;
      i <
      this.count;
      i++
    ) {
      const n =
        i * 3;

      const projected =
        this.project(
          p[n],
          p[n + 1],
          p[n + 2]
        );

      const size =
        clamp(
          projected.scale /
            146,
          0.88,
          1.48
        );

      ctx.rect(
        projected.x,
        projected.y,
        size,
        size
      );
    }

    ctx.fillStyle =
      "rgba(255,164,205,0.82)";

    ctx.fill();

    /*
    Blossom highlights.
    */

    ctx.beginPath();

    for (
      let i =
        woodyCount;
      i <
      this.count;
      i += 17
    ) {
      const n =
        i * 3;

      const projected =
        this.project(
          p[n],
          p[n + 1],
          p[n + 2]
        );

      ctx.rect(
        projected.x,
        projected.y,
        1.18,
        1.18
      );
    }

    ctx.fillStyle =
      "rgba(255,228,238,0.72)";

    ctx.fill();

    ctx.globalAlpha = 1;

    ctx.globalCompositeOperation =
      "source-over";
  }
}