(() => {
  'use strict';

  const CONFIG = {
    to: 'Sudipta',
    from: 'LUCKY',
    age: 21,

    reasons: [
      'তুই আমার উপর রেগে গেলেই "ছাগল" বলিস',
      'আর শুধু শুধু চড় মারিস',
      'তোর সঙ্গে থাকলে আমার সবসময় মনে হয় যে একজন ভালো প্রকৃত বান্ধবী পেয়েছি',
      'আর তুই আমাকে গেম এ কোনোদিনও হারাতে পারবি না 🤣'
    ],

    photos: [
      { src: 'img2.jpeg', caption: '✨' },
      { src: './img3.jpeg', caption: '🖤' },
      { src: './img5.jpeg', caption: 'Us 🤞🏻' },
      { src: './img4.jpeg', caption: '🌹' },
      { src: './img1.jpeg', caption: '🎀' }
    ],

    // BIRTHDAY LETTER
    letter: [
      'Happy Birthday, প্রকৃত বান্ধবী ! ❤️🎂',
      'You’re honestly such a sweet and amazing person.',
      'I’m really glad I have a friend like you in my life.',
      'Thank you for always being there, for all the laughs, and for putting up with my nonsense. 😁',
      'I hope you always stay happy, keep smiling, and achieve everything you want in life.',
      'Have the best birthday ever! 🥳❤️',
      'Stay blessed and keep being the amazing person you are! ✨'
    ]
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;

      let t = Math.imul(a ^ a >>> 15, 1 | a);

      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;

      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ---------- personalise static text ---------- */

  document.title = `Happy Birthday, ${CONFIG.to}`;

  $$('[data-to]').forEach(e => {
    e.textContent = CONFIG.to;
  });

  $$('[data-age]').forEach(e => {
    e.textContent = CONFIG.age;
  });

  $('#env-title').textContent = `One last thing, ${CONFIG.to}…`;
  $('#env-sub').textContent = `${CONFIG.from} wrote you a letter.`;

  $('.sign').innerHTML = `Made with love, just for you — <b></b> 💛`;
  $('.sign b').textContent = CONFIG.from;


  /* ================================================================
     Sound
     ================================================================ */

  const Snd = (() => {

    let ctx = null;
    let master = null;
    let on = true;

    const ensure = () => {

      if (!ctx) {

        try {

          ctx = new (
            window.AudioContext ||
            window.webkitAudioContext
          )();

          master = ctx.createGain();
          master.gain.value = .5;
          master.connect(ctx.destination);

        } catch (e) {

          ctx = null;

        }

      }

      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }

      return ctx;
    };


    const tone = (
      f,
      d = .2,
      type = 'sine',
      v = .2,
      to = null,
      at = 0
    ) => {

      if (!on || !ensure()) return;

      const t = ctx.currentTime + at;

      const o = ctx.createOscillator();
      const g = ctx.createGain();

      o.type = type;
      o.frequency.setValueAtTime(f, t);

      if (to) {
        o.frequency.exponentialRampToValueAtTime(
          to,
          t + d
        );
      }

      g.gain.setValueAtTime(.0001, t);

      g.gain.exponentialRampToValueAtTime(
        v,
        t + .012
      );

      g.gain.exponentialRampToValueAtTime(
        .0001,
        t + d
      );

      o.connect(g);
      g.connect(master);

      o.start(t);
      o.stop(t + d + .05);
    };


    const noise = (
      d = .15,
      v = .25,
      f = 1200,
      at = 0
    ) => {

      if (!on || !ensure()) return;

      const t = ctx.currentTime + at;

      const n = Math.max(
        1,
        (ctx.sampleRate * d) | 0
      );

      const buf = ctx.createBuffer(
        1,
        n,
        ctx.sampleRate
      );

      const data = buf.getChannelData(0);

      for (let i = 0; i < n; i++) {

        data[i] =
          (Math.random() * 2 - 1) *
          (1 - i / n);

      }

      const src = ctx.createBufferSource();

      const flt = ctx.createBiquadFilter();

      const g = ctx.createGain();

      src.buffer = buf;

      flt.type = 'bandpass';
      flt.frequency.value = f;

      g.gain.setValueAtTime(v, t);

      g.gain.exponentialRampToValueAtTime(
        .0001,
        t + d
      );

      src.connect(flt);
      flt.connect(g);
      g.connect(master);

      src.start(t);
    };


    return {

      unlock: ensure,

      toggle() {
        on = !on;
        return on;
      },

      tick: () =>
        tone(
          520 + Math.random() * 80,
          .05,
          'triangle',
          .05
        ),

      twang: () => {
        tone(190, .5, 'triangle', .25, 90);
        tone(380, .3, 'sine', .07, 190);
      },

      hit: () => {
        tone(220, .15, 'square', .1, 120);
        noise(.12, .2, 900);
      },

      pop: () => {
        noise(.09, .35, 1800);
        tone(300, .08, 'sine', .2, 90);
      },

      chime: () =>
        [784, 988, 1175, 1568].forEach(
          (f, i) =>
            tone(
              f,
              .7,
              'sine',
              .1,
              null,
              i * .09
            )
        ),

      drop: () =>
        tone(
          150,
          .12,
          'sine',
          .25,
          70
        ),

      puff: () =>
        noise(
          .35,
          .18,
          500
        ),

      sparkle: () =>
        [1568, 2093].forEach(
          (f, i) =>
            tone(
              f,
              .35,
              'sine',
              .06,
              null,
              i * .07
            )
        )
    };

  })();


  /* ================================================================
     FX canvas
     ================================================================ */

  const FX = (() => {

    const cv = $('#fx');
    const c = cv.getContext('2d');

    const PAL = [
      '#ff6b9a',
      '#f6a93b',
      '#2fc8b9',
      '#9d7cf6',
      '#ffd166',
      '#ffffff',
      '#f5654f'
    ];

    let W = 0;
    let H = 0;

    let stars = [];
    let petals = [];
    let parts = [];

    let starA = 0;
    let starT = 0;

    let petA = 0;
    let petT = 0;

    let rainRate = 0;


    function size() {

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      const r = cv.getBoundingClientRect();

      W = r.width;
      H = r.height;

      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);

      c.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      const ns = RM ? 30 : 90;
      const np = RM ? 8 : 24;

      stars = Array.from(
        { length: ns },
        (_, i) => ({
          x: rand(0, W),
          y: rand(0, H),
          r: rand(.5, 1.5),
          ph: rand(0, 6.28),
          sp: rand(.6, 1.8),
          vy: rand(-2, -8),
          spark: i % 7 === 0
        })
      );

      petals = Array.from(
        { length: np },
        () => ({
          x: rand(0, W),
          y: rand(0, H),
          s: rand(5, 11),
          vy: rand(12, 26),
          ph: rand(0, 6.28),
          sw: rand(8, 22),
          rot: rand(-.6, .6),
          c: pick([
            '#f7a1bf',
            '#ff8fab',
            '#f6b25a',
            '#f27a9c'
          ])
        })
      );

    }


    function heart(x, y, s, rot) {

      c.save();

      c.translate(x, y);
      c.rotate(rot);
      c.scale(
        s / 10,
        s / 10
      );

      c.beginPath();

      c.moveTo(0, -4);

      c.bezierCurveTo(
        -2,
        -9,
        -10,
        -8,
        -10,
        -1
      );

      c.bezierCurveTo(
        -10,
        5,
        -3,
        8,
        0,
        12
      );

      c.bezierCurveTo(
        3,
        8,
        10,
        5,
        10,
        -1
      );

      c.bezierCurveTo(
        10,
        -8,
        2,
        -9,
        0,
        -4
      );

      c.closePath();

      c.fill();

      c.restore();
    }


    function spark(x, y, r) {

      c.beginPath();

      c.moveTo(
        x,
        y - r
      );

      c.quadraticCurveTo(
        x,
        y,
        x + r,
        y
      );

      c.quadraticCurveTo(
        x,
        y,
        x,
        y + r
      );

      c.quadraticCurveTo(
        x,
        y,
        x - r,
        y
      );

      c.quadraticCurveTo(
        x,
        y,
        x,
        y - r
      );

      c.fill();
    }


    function burst(x, y, o = {}) {

      const n = o.n || 24;

      const cols = o.colors || PAL;

      const shapes =
        o.shapes || ['r', 'c'];

      for (let i = 0; i < n; i++) {

        const a = rand(0, 6.283);

        const sp =
          (o.speed || 260) *
          rand(.35, 1.1);

        parts.push({

          x,
          y,

          vx:
            Math.cos(a) * sp,

          vy:
            Math.sin(a) * sp -
            (o.up || 80),

          g:
            o.g == null
              ? 520
              : o.g,

          life: 0,

          max:
            (o.life || 1.2) *
            rand(.7, 1.3),

          size:
            (o.size || 6) *
            rand(.6, 1.4),

          col: pick(cols),

          shape: pick(shapes),

          rot: rand(0, 6.28),

          vr: rand(-10, 10),

          drag: 1.6

        });

      }

    }


    function firework(x, y, cols) {

      cols =
        cols ||
        [
          pick(PAL),
          pick(PAL)
        ];

      const n = 38;

      for (let i = 0; i < n; i++) {

        const a =
          (i / n) *
          6.283;

        const sp =
          95 +
          (i % 2) * 38;

        parts.push({

          x,
          y,

          vx:
            Math.cos(a) * sp,

          vy:
            Math.sin(a) * sp,

          g: 70,

          life: 0,

          max: rand(1.3, 1.9),

          size: rand(2.6, 4.2),

          col:
            cols[i % cols.length],

          shape: 'c',

          rot: 0,

          vr: 0,

          drag: .9

        });

      }

    }


    function rain(dt) {

      if (
        rainRate <= 0 ||
        parts.length > 260
      ) return;

      if (
        Math.random() <
        rainRate * dt * 40
      ) {

        parts.push({

          x: rand(0, W),

          y: -8,

          vx: rand(-14, 14),

          vy: rand(50, 120),

          g: 0,

          life: 0,

          max: 12,

          size: rand(3, 6),

          col: pick(PAL),

          shape: 'r',

          rot: rand(0, 6),

          vr: rand(-6, 6),

          drag: 0

        });

      }

    }


    let last = performance.now();


    function frame(now) {

      const dt =
        Math.min(
          (now - last) / 1000,
          .05
        );

      last = now;

      c.clearRect(
        0,
        0,
        W,
        H
      );

      const k =
        Math.min(
          1,
          dt * 2
        );

      starA +=
        (starT - starA) * k;

      petA +=
        (petT - petA) * k;


      if (starA > .01) {

        for (const s of stars) {

          s.y +=
            s.vy * dt;

          if (s.y < -6) {

            s.y = H + 6;

            s.x = rand(
              0,
              W
            );

          }

          const tw =
            .35 +
            .65 *
            (
              .5 +
              .5 *
              Math.sin(
                now / 1000 *
                s.sp +
                s.ph
              )
            );

          c.globalAlpha =
            starA * tw;

          c.fillStyle =
            s.spark
              ? '#f6b96a'
              : '#fff';

          if (s.spark) {

            spark(
              s.x,
              s.y,
              3.2 +
              s.r * 1.4
            );

          } else {

            c.beginPath();

            c.arc(
              s.x,
              s.y,
              s.r,
              0,
              6.283
            );

            c.fill();

          }

        }

      }


      if (petA > .01) {

        for (const p of petals) {

          p.y +=
            p.vy * dt;

          p.ph += dt;

          if (p.y > H + 12) {

            p.y = -12;

            p.x = rand(
              0,
              W
            );

          }

          c.globalAlpha =
            petA * .8;

          c.fillStyle = p.c;

          heart(
            p.x +
              Math.sin(p.ph) *
              p.sw,
            p.y,
            p.s,
            p.rot +
              Math.sin(p.ph) * .4
          );

        }

      }


      rain(dt);


      for (
        let i = parts.length - 1;
        i >= 0;
        i--
      ) {

        const p = parts[i];

        p.life += dt;

        if (
          p.life > p.max ||
          p.y > H + 40
        ) {

          parts.splice(i, 1);
          continue;

        }

        p.vx *=
          1 -
          Math.min(
            1,
            p.drag * dt
          );

        p.vy +=
          p.g * dt;

        p.vy *=
          1 -
          Math.min(
            1,
            p.drag * .4 * dt
          );

        p.x +=
          p.vx * dt;

        p.y +=
          p.vy * dt;

        p.rot +=
          p.vr * dt;

        c.globalAlpha =
          Math.max(
            0,
            Math.min(
              1,
              (p.max - p.life) /
              (p.max * .4)
            )
          );

        c.fillStyle = p.col;


        if (p.shape === 'c') {

          c.beginPath();

          c.arc(
            p.x,
            p.y,
            p.size / 2,
            0,
            6.283
          );

          c.fill();

        } else if (p.shape === 'h') {

          heart(
            p.x,
            p.y,
            p.size,
            p.rot * .2
          );

        } else {

          c.save();

          c.translate(
            p.x,
            p.y
          );

          c.rotate(
            p.rot
          );

          c.fillRect(
            -p.size / 2,
            -p.size / 4,
            p.size,
            p.size / 2
          );

          c.restore();

        }

      }

      c.globalAlpha = 1;

      requestAnimationFrame(frame);

    }


    size();

    requestAnimationFrame(frame);

    window.addEventListener(
      'resize',
      size
    );


    return {

      burst,
      firework,
      size,

      ambient(mode) {

        starT =
          mode === 'night'
            ? 1
            : 0;

        petT =
          mode === 'day'
            ? 1
            : 0;

      },

      rain(v) {

        rainRate = v;

      },

      clear() {

        parts.length = 0;

      }

    };

  })();


  /* ================================================================
     Flow control
     ================================================================ */

  let run = 0;
  let tapNext = null;
  let current = '';

  const CANCEL = {};

  const app = $('#app');


  function activate(id) {

    current = id;

    $$('.scene').forEach(
      s =>
        s.classList.toggle(
          'active',
          s.id === 'sc-' + id
        )
    );

  }


  app.addEventListener(
    'pointerup',
    e => {

      if (
        e.target.closest(
          'button,.no-tap'
        )
      ) return;

      if (tapNext) {
        tapNext();
      }

    }
  );


  document.addEventListener(
    'keydown',
    e => {

      if (
        (
          e.key === 'Enter' ||
          e.key === ' '
        ) &&
        tapNext &&
        e.target === document.body
      ) {

        e.preventDefault();
        tapNext();

      }

    }
  );


  /* ---------- background music ---------- */

  const bgMusic = $('#bg-music');

  if (bgMusic) {
    bgMusic.volume = .35;
  }

  const playBgMusic = () => {

    if (!bgMusic || !bgMusic.paused) return;

    bgMusic.play().catch(() => {
      /* file missing or blocked — fail silently */
    });

  };


  document.addEventListener(
    'pointerdown',
    () => {
      Snd.unlock();
      playBgMusic();
    },
    { once: true }
  );


  $('#snd').addEventListener(
    'click',
    e => {

      const on =
        Snd.toggle();

      e.currentTarget.textContent =
        on ? '🔊' : '🔇';

      e.currentTarget.setAttribute(
        'aria-pressed',
        String(on)
      );

      e.currentTarget.setAttribute(
        'aria-label',
        on
          ? 'Turn sound off'
          : 'Turn sound on'
      );

      if (bgMusic) {

        if (on) {
          playBgMusic();
        } else {
          bgMusic.pause();
        }

      }

    }
  );


  function resetAll() {

    document.body.classList.remove(
      'night'
    );

    FX.ambient('day');

    FX.rain(0);

    FX.clear();

    $('#flash').classList.remove(
      'on'
    );

    const orb = $('#orb');

    orb.getAnimations().forEach(
      a => a.cancel()
    );

    orb.style.display = 'none';

    $$('.scene').forEach(
      s =>
        s.classList.remove(
          'play'
        )
    );

  }


  async function flow(start) {

    const id = ++run;

    const w = ms =>
      new Promise(
        (res, rej) =>
          setTimeout(
            () =>
              id === run
                ? res()
                : rej(CANCEL),
            ms
          )
      );


    const tap = () =>
      new Promise(
        (res, rej) => {

          tapNext = () => {

            tapNext = null;

            id === run
              ? res()
              : rej(CANCEL);

          };

        }
      );


    const ok = () => {

      if (id !== run) {
        throw CANCEL;
      }

    };


    let n = start;


    try {

      while (n) {

        n =
          await scenes[n]({
            w,
            tap,
            ok
          });

      }

    } catch (e) {

      if (e !== CANCEL) {
        console.error(e);
      }

    }

  }


  const click = el =>
    new Promise(
      res =>
        el.addEventListener(
          'click',
          res,
          { once: true }
        )
    );


  const center = el => {

    const r =
      el.getBoundingClientRect();

    return [
      r.left + r.width / 2,
      r.top + r.height / 2
    ];

  };


  const replayCss = (
    el,
    cls
  ) => {

    el.classList.remove(cls);

    void el.offsetWidth;

    el.classList.add(cls);

  };


  /* ================================================================
     Scenes
     ================================================================ */

  const scenes = {
    intro,
    hb,
    tree,
    cake,
    pop,
    lane,
    env,
    letter,
    end
  };


  /* ================================================================
     1 — Bow & Heart
     ================================================================ */

  async function intro({ w, ok }) {

    resetAll();

    const sc = $('#sc-intro');

    const bow = $('#bow');

    const heart = $('#heart');

    const arc = $('#bowarc');

    const string = $('#bowstring');

    const arrow = $('#arrow');

    const hint =
      $('.hint', sc);


    heart.classList.remove(
      'hit'
    );

    hint.classList.remove(
      'gone'
    );


    arrow
      .getAnimations()
      .forEach(
        a => a.cancel()
      );


    let pull = 0;
    let pulling = false;
    let fired = false;

    let sx = 0;
    let sy = 0;

    let tickAt = 0;
    let t0 = 0;

    let angle = 0;
    let dist = 0;


    const setPull = p => {

      pull = p;

      const tip =
        50 - p * .2;

      arc.setAttribute(
        'd',
        `M${tip} 12 Q${100 - p * .55} 75 ${tip} 138`
      );

      string.setAttribute(
        'points',
        `${tip},12 ${50 - p},75 ${tip},138`
      );

      arrow.style.transform =
        `translate(${-p}px,0)`;

    };


    const aim = () => {

      bow.style.transform =
        'none';

      const [bx, by] =
        center(bow);

      const [hx, hy] =
        center(heart);

      angle =
        Math.atan2(
          hy - by,
          hx - bx
        );

      dist =
        Math.hypot(
          hx - bx,
          hy - by
        );

      bow.style.transform =
        `rotate(${angle}rad)`;

    };


    setPull(0);

    activate('intro');

    aim();


    const onResize = () =>
      aim();

    window.addEventListener(
      'resize',
      onResize
    );


    const tween = (
      from,
      to,
      ms
    ) =>
      new Promise(
        res => {

          const s =
            performance.now();

          const step = now => {

            const k =
              Math.min(
                1,
                (now - s) / ms
              );

            setPull(
              from +
              (to - from) * k
            );

            if (k < 1) {

              requestAnimationFrame(
                step
              );

            } else {

              res();

            }

          };

          requestAnimationFrame(
            step
          );

        }
      );


    let fire;

    const fired$ =
      new Promise(
        res =>
          fire = res
      );


    const release = async () => {

      if (fired) return;

      fired = true;

      hint.classList.add(
        'gone'
      );

      const p = pull;

      Snd.twang();

      const tRest =
        dist - 77 + 6;

      const fl =
        arrow.animate(
          [
            {
              transform:
                `translate(${-p}px,0)`
            },
            {
              transform:
                `translate(${tRest}px,0)`
            }
          ],
          {
            duration: 380,
            easing:
              'cubic-bezier(.35,.1,.7,1)',
            fill: 'forwards'
          }
        );


      setPull(0);

      arrow.style.transform =
        '';


      arc.setAttribute(
        'd',
        'M50 12 Q100 75 50 138'
      );


      await fl.finished;

      fire();

    };


    const autoPull = async () => {

      if (
        fired ||
        pulling
      ) return;

      pulling = true;

      Snd.tick();

      await tween(
        0,
        38,
        420
      );

      pulling = false;

      release();

    };


    const down = e => {

      if (
        fired ||
        e.target.closest('button')
      ) return;

      pulling = true;

      sx = e.clientX;
      sy = e.clientY;

      t0 =
        performance.now();

      tickAt = 0;


      try {

        sc.setPointerCapture(
          e.pointerId
        );

      } catch (_) {}

    };


    const move = e => {

      if (
        !pulling ||
        fired
      ) return;

      const p =
        Math.min(
          38,
          Math.hypot(
            e.clientX - sx,
            e.clientY - sy
          ) * .35
        );

      setPull(p);


      if (
        p - tickAt > 8
      ) {

        Snd.tick();

        tickAt = p;

      }

    };


    const up = async () => {

      if (
        !pulling ||
        fired
      ) return;

      pulling = false;


      if (pull >= 12) {

        return release();

      }


      if (
        performance.now() -
        t0 < 350
      ) {

        return autoPull();

      }


      await tween(
        pull,
        0,
        160
      );

    };


    const key = e => {

      if (
        (
          e.key === 'Enter' ||
          e.key === ' '
        ) &&
        !fired
      ) {

        e.preventDefault();

        autoPull();

      }

    };


    sc.addEventListener(
      'pointerdown',
      down
    );

    sc.addEventListener(
      'pointermove',
      move
    );

    sc.addEventListener(
      'pointerup',
      up
    );

    sc.addEventListener(
      'pointercancel',
      up
    );

    document.addEventListener(
      'keydown',
      key
    );


    await fired$;

    sc.removeEventListener(
      'pointerdown',
      down
    );

    sc.removeEventListener(
      'pointermove',
      move
    );

    sc.removeEventListener(
      'pointerup',
      up
    );

    sc.removeEventListener(
      'pointercancel',
      up
    );

    document.removeEventListener(
      'keydown',
      key
    );

    window.removeEventListener(
      'resize',
      onResize
    );


    ok();


    const [hx, hy] =
      center(heart);

    Snd.hit();

    heart.classList.add(
      'hit'
    );


    FX.burst(
      hx,
      hy,
      {
        n: 30,
        colors: [
          '#ff6b9a',
          '#ffb3c8',
          '#f6a93b',
          '#fff'
        ],
        shapes: [
          'h',
          'c'
        ],
        speed: 300,
        size: 9,
        life: 1
      }
    );


    await w(260);


    const orb = $('#orb');

    const r0 = 72;


    Object.assign(
      orb.style,
      {
        display: 'block',
        left:
          hx -
          r0 / 2 +
          'px',
        top:
          hy -
          r0 / 2 +
          'px',
        width:
          r0 + 'px',
        height:
          r0 + 'px'
      }
    );


    const R =
      Math.hypot(
        Math.max(
          hx,
          innerWidth - hx
        ),
        Math.max(
          hy,
          innerHeight - hy
        )
      );


    orb.animate(
      [
        {
          transform:
            'scale(.6)'
        },
        {
          transform:
            'scale(1)',
          offset: .12
        },
        {
          transform:
            `scale(${(R * 2) / r0 + 1})`
        }
      ],
      {
        duration: 950,
        easing:
          'cubic-bezier(.6,0,.9,.5)',
        fill: 'forwards'
      }
    );


    Snd.sparkle();

    await w(950);

    return 'hb';

  }


  /* ================================================================
     2 — Happy Birthday
     ================================================================ */

  async function hb({ w }) {

    const sc = $('#sc-hb');

    sc.classList.remove(
      'play'
    );

    void sc.offsetWidth;

    FX.ambient('off');

    activate('hb');

    sc.classList.add(
      'play'
    );


    const orb = $('#orb');

    await w(120);


    orb.animate(
      [
        { opacity: 1 },
        { opacity: 0 }
      ],
      {
        duration: 700,
        fill: 'forwards'
      }
    );


    Snd.chime();

    await w(3400);


    $('#flash').classList.add(
      'on'
    );

    await w(650);

    return 'tree';

  }


  /* ================================================================
     3 — Heart Tree
     ================================================================ */

  function buildTree() {

    const gb = $('#branches');
    const gl = $('#leaves');

    gb.innerHTML = '';
    gl.innerHTML = '';


    const NS =
      'http://www.w3.org/2000/svg';

    const R =
      mulberry32(11);


    const cx = 200;
    const cy = 168;
    const S = 104;


    const inHeart = (
      x,
      y,
      k
    ) => {

      const X =
        (x - cx) /
        (S * k);

      const Y =
        (cy - y) /
        (S * k);

      const a =
        X * X +
        Y * Y -
        1;

      return (
        a * a * a -
        X * X *
        Y * Y *
        Y * Y * Y <= 0
      );

    };


    const list = [];


    (
      function grow(
        x,
        y,
        a,
        len,
        wd,
        d
      ) {

        const bend =
          (R() - .5) * .35;


        const x2 =
          x +
          Math.sin(a) *
          len;

        const y2 =
          y -
          Math.cos(a) *
          len;


        const mx =
          x +
          Math.sin(
            a + bend
          ) *
          len *
          .5;

        const my =
          y -
          Math.cos(
            a + bend
          ) *
          len *
          .5;


        list.push({
          d:
            `M${x.toFixed(1)} ${y.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
          w: wd,
          depth: d
        });


        if (d >= 6) return;


        const kids =
          d < 1
            ? 2
            : (
              R() < .35
                ? 3
                : 2
            );


        for (
          let i = 0;
          i < kids;
          i++
        ) {

          const spread =
            kids === 2
              ? (
                i
                  ? 1
                  : -1
              ) *
              (
                .38 +
                R() * .22
              )
              : (
                i - 1
              ) *
              (
                .42 +
                R() * .15
              );


          const na =
            a + spread;

          const nl =
            len *
            (
              .7 +
              R() * .08
            );


          const ex =
            x2 +
            Math.sin(na) *
            nl;

          const ey =
            y2 -
            Math.cos(na) *
            nl;


          if (
            !inHeart(
              ex,
              ey,
              1.0
            )
          ) continue;


          grow(
            x2,
            y2,
            na,
            nl,
            Math.max(
              wd * .68,
              1.2
            ),
            d + 1
          );

        }

      }
    )(
      200,
      520,
      0,
      215,
      16,
      0
    );


    for (const b of list) {

      const p =
        document.createElementNS(
          NS,
          'path'
        );

      p.setAttribute(
        'd',
        b.d
      );

      p.setAttribute(
        'class',
        'br'
      );

      p.setAttribute(
        'stroke-width',
        b.w.toFixed(1)
      );

      gb.appendChild(p);


      const L =
        Math.ceil(
          p.getTotalLength()
        ) + 2;


      p.style.setProperty(
        '--l',
        L
      );


      p.style.animationDelay =
        (
          b.depth * .3
        ).toFixed(2) +
        's';

    }


    const cols = [
      '#f0567f',
      '#f78bb0',
      '#ff9ab8',
      '#f5a34a',
      '#f7b955',
      '#e8446e',
      '#ffc36b',
      '#f26d92'
    ];


    const pts = [];

    let tries = 0;


    while (
      pts.length < 260 &&
      tries < 6000
    ) {

      tries++;


      const x =
        cx +
        (R() * 2 - 1) *
        S *
        1.2;


      const y =
        cy -
        (R() * 2.35 - 1.05) *
        S;


      if (
        inHeart(
          x,
          y,
          1
        )
      ) {

        pts.push([
          x,
          y
        ]);

      }

    }


    const top =
      cy -
      1.3 * S;

    const bottom =
      cy + S;


    for (const [x, y] of pts) {

      const g =
        document.createElementNS(
          NS,
          'g'
        );


      g.setAttribute(
        'transform',
        `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((R() - .5) * 60).toFixed(0)})`
      );


      const u =
        document.createElementNS(
          NS,
          'use'
        );


      const s =
        .65 +
        R() * .6;

      const t =
        (bottom - y) /
        (bottom - top);


      u.setAttribute(
        'href',
        '#hrt'
      );

      u.setAttribute(
        'class',
        'lf'
      );

      u.style.color =
        cols[
          (R() * cols.length) | 0
        ];

      u.style.setProperty(
        '--s',
        s.toFixed(2)
      );


      u.style.animationDelay =
        (
          2.1 +
          t * 1.5 +
          R() * .45
        ).toFixed(2) +
        's';


      g.appendChild(u);

      gl.appendChild(g);

    }

  }


  async function tree({ w, tap }) {

    const sc =
      $('#sc-tree');

    const hint =
      $('.tap-hint', sc);


    sc.classList.remove(
      'play'
    );

    hint.classList.remove(
      'on'
    );


    buildTree();

    FX.ambient('day');

    activate('tree');

    sc.classList.add(
      'play'
    );


    await w(450);

    $('#flash').classList.remove(
      'on'
    );

    await w(3000);

    Snd.chime();

    await w(700);

    hint.classList.add(
      'on'
    );

    await tap();

    return 'cake';

  }


  /* ================================================================
     4 — Cake
     ================================================================ */

  async function cake({ w, tap }) {

    const sc =
      $('#sc-cake');


    const lys =
      $$('.ly', sc);

    const icing =
      $('.icing', sc);

    const candle =
      $('.candle', sc);

    const flame =
      $('.flame', sc);

    const glow =
      $('.glow', sc);


    [
      ...lys,
      icing,
      candle
    ].forEach(
      e =>
        e.classList.remove(
          'in'
        )
    );


    flame.classList.remove(
      'on',
      'out'
    );

    glow.classList.remove(
      'on'
    );


    const status =
      $('.status', sc);

    const wl =
      $('.wishline', sc);

    const ws =
      $('.wishsub', sc);

    const sh =
      $('.small-hint', sc);


    status.textContent =
      'Baking something sweet…';

    wl.textContent = '';
    ws.textContent = '';

    sh.classList.remove(
      'on'
    );


    document.body.classList.add(
      'night'
    );

    FX.ambient('night');

    activate('cake');


    await w(900);


    for (const l of lys) {

      l.classList.add(
        'in'
      );

      Snd.drop();

      await w(300);

    }


    await w(350);

    icing.classList.add(
      'in'
    );

    Snd.sparkle();

    await w(800);


    candle.classList.add(
      'in'
    );

    Snd.drop();

    await w(750);


    flame.classList.add(
      'on'
    );

    glow.classList.add(
      'on'
    );

    status.textContent = '';

    Snd.chime();


    const [fx, fy] =
      center(candle);


    FX.burst(
      fx,
      fy - 10,
      {
        n: 46,
        speed: 340,
        up: 160,
        g: 520,
        life: 1.6,
        size: 7,
        shapes: [
          'r',
          'c',
          'r'
        ]
      }
    );


    const msg =
      `Happy Birthday, ${CONFIG.to}!`;


    for (
      let i = 1;
      i <= msg.length;
      i++
    ) {

      wl.textContent =
        msg.slice(
          0,
          i
        );

      await w(55);

    }


    ws.textContent =
      'Make a wish 🕯️';


    await w(700);

    sh.classList.add(
      'on'
    );


    await tap();


    flame.classList.remove(
      'on'
    );

    flame.classList.add(
      'out'
    );

    glow.classList.remove(
      'on'
    );


    Snd.puff();

    sh.classList.remove(
      'on'
    );


    FX.burst(
      fx,
      fy - 12,
      {
        n: 10,
        colors: [
          'rgba(255,255,255,.55)'
        ],
        shapes: [
          'c'
        ],
        speed: 30,
        up: 90,
        g: -90,
        life: 1.2,
        size: 9
      }
    );


    await w(800);

    return 'pop';

  }


  /* ================================================================
     5 — Balloons
     ================================================================ */

  async function pop({ w, ok }) {

    const sky =
      $('#sky');

    const reasons =
      $('#reasons');

    const next =
      $('#pop-next');


    sky.innerHTML = '';

    reasons.innerHTML = '';

    sky.classList.remove(
      'done'
    );

    next.hidden = true;


    const cols = [
      '#9d7cf6',
      '#2fc8b9',
      '#f5654f',
      '#f7b23f'
    ];


    let popped = 0;

    let finish;

    const all =
      new Promise(
        r =>
          finish = r
      );


    cols.forEach(
      (col, i) => {

        const b =
          document.createElement(
            'button'
          );


        b.type = 'button';

        b.className =
          'balloon';


        b.setAttribute(
          'aria-label',
          `Pop balloon ${i + 1}`
        );


        b.innerHTML =
          `
          <svg
            viewBox="0 0 64 110"
            aria-hidden="true"
          >
            <path
              d="M32 82q-8 10 0 18t0 10"
              fill="none"
              stroke="rgba(255,255,255,.45)"
              stroke-width="1.2"
            />

            <path
              d="M32 4C50 4 60 20 60 38C60 58 44 72 32 74C20 72 4 58 4 38C4 20 14 4 32 4Z"
              fill="${col}"
            />

            <path
              d="M50 22C58 34 56 54 42 66C52 56 56 38 50 22Z"
              fill="#000"
              opacity=".14"
            />

            <ellipse
              cx="20"
              cy="24"
              rx="5"
              ry="9"
              fill="#fff"
              opacity=".35"
              transform="rotate(20 20 24)"
            />

            <path
              d="M32 74l-5 8h10z"
              fill="${col}"
            />
          </svg>
        `;


        b.addEventListener(
          'click',
          () => {

            if (
              b.classList.contains(
                'gone'
              )
            ) return;


            b.classList.add(
              'gone'
            );


            const [x, y] =
              center(b);


            FX.burst(
              x,
              y - 14,
              {
                n: 26,
                colors: [
                  col,
                  '#fff',
                  '#f6a93b'
                ],
                shapes: [
                  'c',
                  'r',
                  'h'
                ],
                speed: 320,
                g: 600,
                life: 1,
                size: 7
              }
            );


            Snd.pop();


            const card =
              document.createElement(
                'div'
              );

            card.className =
              'reason';

            card.style.setProperty(
              '--c',
              col
            );


            const box =
              document.createElement(
                'div'
              );

            const tag =
              document.createElement(
                'small'
              );

            const txt =
              document.createElement(
                'b'
              );


            tag.textContent =
              `Reason no. ${popped + 1} 💘`;


            txt.textContent =
              CONFIG.reasons[
                popped
              ] || '';


            box.append(
              tag,
              txt
            );


            card.append(
              box,
              Object.assign(
                document.createElement(
                  'span'
                ),
                {
                  textContent:
                    '✨'
                }
              )
            );


            reasons.appendChild(
              card
            );


            reasons.scrollIntoView({
              block: 'nearest',
              behavior: 'smooth'
            });


            popped++;


            if (
              popped ===
              cols.length
            ) {

              finish();

            }

          }
        );


        sky.appendChild(b);

      }
    );


    activate('pop');

    await all;

    ok();

    await w(900);

    sky.classList.add(
      'done'
    );

    await w(700);

    next.hidden = false;

    await click(next);

    ok();

    return 'lane';

  }


  /* ================================================================
     6 — Memory Lane
     ================================================================ */

  async function lane({ w, ok }) {

    const track =
      $('#track');

    const dots =
      $('#dots');

    const lights =
      $('#lights');

    const hintEl =
      $('#lane-hint');

    const cta =
      $('#lane-cta');


    track.innerHTML = '';

    dots.innerHTML = '';

    lights.innerHTML = '';

    hintEl.style.opacity = 1;


    const grads = [
      '#f6d9c8,#e9b6a0',
      '#dccbe8,#b9a0d6',
      '#cfe3df,#9fc4bb',
      '#f7e3b5,#eab873',
      '#f3cfdc,#e39ab5'
    ];


    CONFIG.photos.forEach(
      (p, i) => {

        const f =
          document.createElement(
            'figure'
          );

        f.className =
          'pol';


        const ph =
          document.createElement(
            'div'
          );

        ph.className =
          'ph';


        if (p.src) {

          const im =
            new Image();

          im.src =
            p.src;

          im.alt =
            p.caption;

          im.draggable =
            false;

          ph.appendChild(im);

        } else {

          ph.classList.add(
            'empty'
          );

          ph.style.background =
            `linear-gradient(160deg,${grads[i % grads.length]})`;


          ph.innerHTML =
            `
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 8h3l1.500-2h7L17 8h3v11H4z"/>
              <circle
                cx="12"
                cy="13"
                r="3.500"
              />
            </svg>

            <span>
              your photo here
            </span>
          `;

        }


        const cap =
          document.createElement(
            'figcaption'
          );

        cap.className =
          'cap';

        cap.textContent =
          p.caption;


        const pin =
          document.createElement(
            'span'
          );

        pin.className =
          'pin';


        f.append(
          pin,
          ph,
          cap
        );


        track.appendChild(
          f
        );


        f.addEventListener(
          'click',
          () =>
            f.scrollIntoView({
              behavior: 'smooth',
              inline: 'center',
              block: 'nearest'
            })
        );


        const d =
          document.createElement(
            'i'
          );

        dots.appendChild(d);

      }
    );


    lights.innerHTML =
      `
      <svg
        viewBox="0 0 100 26"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 8Q50 16 100 8"/>
      </svg>
    `;


    for (
      let i = 0;
      i < 15;
      i++
    ) {

      const t =
        i / 14;

      const b =
        document.createElement(
          'i'
        );


      b.style.left =
        (t * 100) + '%';


      b.style.top =
        (
          8 +
          16 *
          t *
          (1 - t) -
          3 +
          2
        ) + 'px';


      b.style.animationDelay =
        (
          -Math.random() * 2.4
        ) + 's';


      lights.appendChild(
        b
      );

    }


    const pols =
      $$('.pol', track);


    const update = () => {

      const tr =
        track.getBoundingClientRect();

      const mid =
        tr.left +
        tr.width / 2;


      let best = 0;
      let bd = 1e9;


      pols.forEach(
        (p, i) => {

          const r =
            p.getBoundingClientRect();


          const d =
            Math.abs(
              r.left +
              r.width / 2 -
              mid
            );


          const n =
            Math.min(
              d / r.width,
              1
            );


          p.style.setProperty(
            '--s',
            (
              1 -
              n * .1
            ).toFixed(3)
          );


          p.style.opacity =
            (
              1 -
              n * .3
            ).toFixed(2);


          if (d < bd) {

            bd = d;

            best = i;

          }

        }
      );


      $$('i', dots)
        .forEach(
          (d, i) =>
            d.classList.toggle(
              'on',
              i === best
            )
        );


      return best;

    };


    let raf = 0;


    track.onscroll = () => {

      hintEl.style.opacity = 0;

      cancelAnimationFrame(
        raf
      );

      raf =
        requestAnimationFrame(
          update
        );

    };


    const step = dir => {

      const i =
        Math.max(
          0,
          Math.min(
            pols.length - 1,
            update() + dir
          )
        );


      pols[i].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });

    };


    $('#lane-prev').onclick =
      () =>
        step(-1);

    $('#lane-next').onclick =
      () =>
        step(1);


    const key = e => {

      if (
        current !== 'lane'
      ) return;


      if (
        e.key === 'ArrowRight'
      ) {
        step(1);
      }


      if (
        e.key === 'ArrowLeft'
      ) {
        step(-1);
      }

    };


    document.addEventListener(
      'keydown',
      key
    );


    activate('lane');

    track.scrollLeft = 0;

    requestAnimationFrame(
      update
    );

    setTimeout(
      update,
      200
    );


    await click(cta);

    document.removeEventListener(
      'keydown',
      key
    );

    ok();

    return 'env';

  }


  /* ================================================================
     7 — Envelope
     ================================================================ */

  async function env({ w, ok }) {

    const e =
      $('#env');


    e.classList.remove(
      'open'
    );


    activate('env');


    await click(e);

    ok();


    Snd.sparkle();

    e.classList.add(
      'open'
    );


    await w(1200);

    return 'letter';

  }


  /* ================================================================
     8 — Letter
     ================================================================ */

  const seg =
    (
      typeof Intl !== 'undefined' &&
      Intl.Segmenter
    )
      ? new Intl.Segmenter(
          undefined,
          {
            granularity:
              'grapheme'
          }
        )
      : null;


  const graphemes = s =>
    seg
      ? Array.from(
          seg.segment(s),
          x => x.segment
        )
      : Array.from(s);


  async function letter({
    w,
    tap,
    ok
  }) {

    const lines =
      $('#lines');

    const paper =
      $('#paper');

    const wrap =
      $('#paper-wrap');

    const skip =
      $('#skip');

    const hint =
      $('.letter-hint');


    lines.innerHTML = '';

    hint.classList.remove(
      'on'
    );

    skip.classList.remove(
      'ready'
    );

    paper.scrollTop = 0;


    CONFIG.letter.forEach(
      (txt, i) => {

        const p =
          document.createElement(
            'p'
          );


        if (i === 0) {
          p.className =
            'salute';
        }


        const words =
          txt
            .replace(
              '{to}',
              CONFIG.to
            )
            .split(' ');


        words.forEach(
          (wd, wi) => {

            const ws =
              document.createElement(
                'span'
              );

            ws.className =
              'w';


            graphemes(wd)
              .forEach(
                g => {

                  const c =
                    document.createElement(
                      'span'
                    );

                  c.className =
                    'c';

                  c.textContent =
                    g;

                  ws.appendChild(c);

                }
              );


            p.appendChild(ws);


            if (
              wi <
              words.length - 1
            ) {

              p.appendChild(
                document.createTextNode(
                  ' '
                )
              );

            }

          }
        );


        lines.appendChild(p);

      }
    );


    activate('letter');


    let skipped = false;
    let typing = true;


    skip.onclick = () => {

      if (typing) {
        skipped = true;
      }

    };


    wrap.onpointerup = () => {

      if (typing) {
        skipped = true;
      }

    };


    await w(900);


    const chars =
      $$('.c', lines);


    for (
      let i = 0;
      i < chars.length;
      i++
    ) {

      const c =
        chars[i];


      if (skipped) {

        for (
          let j = i;
          j < chars.length;
          j++
        ) {

          chars[j]
            .parentNode
            .parentNode
            .classList.add('on');

          chars[j]
            .classList.add('on');

        }

        break;

      }


      c.parentNode
        .parentNode
        .classList.add('on');


      c.classList.add(
        'on'
      );


      paper.scrollTop =
        paper.scrollHeight;


      const ch =
        c.textContent;


      const last =
        !c.nextSibling &&
        !c.parentNode.nextSibling;


      await w(
        last
          ? 420
          : /[.!?…]/.test(ch)
            ? 210
            : ch === ','
              ? 110
              : 30
      );

    }


    paper.scrollTop =
      paper.scrollHeight;


    typing = false;

    skip.classList.add(
      'ready'
    );

    hint.classList.add(
      'on'
    );


    await Promise.race([
      tap(),
      click(skip)
    ]);


    ok();


    wrap.onpointerup =
      null;

    skip.onclick =
      null;


    return 'end';

  }


  /* ================================================================
     9 — Finale
     ================================================================ */

  async function end({
    w,
    tap,
    ok
  }) {

    const sc =
      $('#sc-end');


    sc.classList.remove(
      'play'
    );

    void sc.offsetWidth;


    activate('end');

    sc.classList.add(
      'play'
    );


    FX.ambient('night');

    FX.rain(.55);

    Snd.chime();


    let stop = false;


    (async () => {

      await w(500);


      while (!stop) {

        FX.firework(
          rand(
            innerWidth * .12,
            innerWidth * .88
          ),
          rand(
            innerHeight * .18,
            innerHeight * .8
          )
        );


        if (
          Math.random() < .5
        ) {
          Snd.sparkle();
        }


        await w(
          rand(
            650,
            1250
          )
        );

      }

    })().catch(
      () => {}
    );


    await click(
      $('#replay')
    );


    stop = true;

    ok();

    FX.rain(0);

    return 'intro';

  }


  /* ================================================================
     Start
     ================================================================ */

  flow('intro');

})();