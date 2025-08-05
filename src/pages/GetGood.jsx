import './GetGood.css';

function GetGood() {
  return (
    <div className="get-good">
      <div className="container">
        <div className="get-good-header">
          <h1>Get Good at Disc Golf</h1>
          <p>Everything you need to know to improve your disc golf game</p>
        </div>

        <div className="get-good-content">
          {/* Flight Numbers Section */}
          <section className="content-section">
            <h2>🔢 Disc Flight Numbers Explained</h2>
            <p>Most discs have 4 numbers printed on them like this: <span className="flight-example">9 | 5 | -2 | 1</span>. These are:</p>
            
            <div className="flight-numbers-table">
              <div className="table-header">
                <div className="col-number">#</div>
                <div className="col-name">Name</div>
                <div className="col-description">What It Means</div>
              </div>
              <div className="table-row">
                <div className="col-number">1</div>
                <div className="col-name">Speed</div>
                <div className="col-description">How fast you must throw the disc to get the intended flight. Ranges from 1–14. Higher = faster (and usually harder to control).</div>
              </div>
              <div className="table-row">
                <div className="col-number">2</div>
                <div className="col-name">Glide</div>
                <div className="col-description">How well the disc stays in the air. Ranges from 1–7. Higher = more float.</div>
              </div>
              <div className="table-row">
                <div className="col-number">3</div>
                <div className="col-name">Turn</div>
                <div className="col-description">Tendency to turn right (for RHBH) early in flight. Ranges from +1 to -5. More negative = more understable.</div>
              </div>
              <div className="table-row">
                <div className="col-number">4</div>
                <div className="col-name">Fade</div>
                <div className="col-description">How much the disc fades left (for RHBH) at the end of flight. Ranges from 0–5. Higher = stronger fade.</div>
              </div>
            </div>

            <div className="example-box">
              <h4>Example:</h4>
              <p>A disc with flight numbers <span className="flight-example">7 | 6 | -3 | 1</span> is a fairway driver that glides well, turns right easily, and finishes with a small left fade — great for beginners.</p>
            </div>
          </section>

          {/* Throwing Form Section */}
          <section className="content-section">
            <h2>🧍‍♂️ Throwing Form (RHBH – Right-Hand Backhand)</h2>
            <p>Form is crucial in disc golf. Here's a breakdown of the fundamentals of a proper backhand throw:</p>

            <div className="form-steps">
              <div className="form-step">
                <h3>🪶 1. Grip</h3>
                <p><strong>Power grip:</strong> All 4 fingers under the rim, thumb on top. Good for drives.</p>
                <p><strong>Fan grip:</strong> Fingers fanned out under the flight plate. Good for control/putting.</p>
                <p>Make sure the disc is firmly in your hand — no wobble.</p>
              </div>

              <div className="form-step">
                <h3>🧍‍♂️ 2. Stance and Reach-Back</h3>
                <p>Start sideways to the target, weight on the back foot.</p>
                <p>Step into an X-step (cross-step) to generate momentum.</p>
                <p>Reach back with a straight arm, disc on a flat or slightly downward plane.</p>
              </div>

              <div className="form-step">
                <h3>💪 3. Pull-Through & Rotation</h3>
                <p>Lead with your elbow, keeping the disc close to your chest.</p>
                <p>Your hips and shoulders should rotate explosively, like a batter swinging a bat.</p>
                <p>Brace your front leg to transfer energy from the ground up.</p>
                <p>Think: <em>"Reach back → pull through → snap."</em></p>
              </div>

              <div className="form-step">
                <h3>✋ 4. Release & Follow Through</h3>
                <p>Keep the disc on a clean angle: flat, hyzer, or anhyzer.</p>
                <p>Snap your wrist for spin (more spin = more stable flight).</p>
                <p>Follow through with your arm across your body, and pivot on your front foot.</p>
              </div>
            </div>

            {/* Common Errors */}
            <div className="errors-section">
              <h3>🎥 Common Form Errors</h3>
              <div className="errors-table">
                <div className="table-header">
                  <div className="col-error">Error</div>
                  <div className="col-causes">What it Causes</div>
                </div>
                <div className="table-row">
                  <div className="col-error">Rounding (pulling in a circular path)</div>
                  <div className="col-causes">Loss of power & accuracy</div>
                </div>
                <div className="table-row">
                  <div className="col-error">Early/late release</div>
                  <div className="col-causes">Nose-up shots, wobble, loss of distance</div>
                </div>
                <div className="table-row">
                  <div className="col-error">No weight shift</div>
                  <div className="col-causes">Weak, arm-only throws</div>
                </div>
                <div className="table-row">
                  <div className="col-error">Over-arming</div>
                  <div className="col-causes">Shoulder strain, poor accuracy</div>
                </div>
              </div>
            </div>
          </section>

          {/* Release Angles Section */}
          <section className="content-section">
            <h2>📐 Release Angles</h2>
            <p>These angles dramatically affect disc flight:</p>

            <div className="angles-table">
              <div className="table-header">
                <div className="col-name">Name</div>
                <div className="col-description">Description</div>
                <div className="col-effect">Flight Effect</div>
              </div>
              <div className="table-row">
                <div className="col-name">Flat</div>
                <div className="col-description">Disc is level to ground</div>
                <div className="col-effect">Neutral flight</div>
              </div>
              <div className="table-row">
                <div className="col-name">Hyzer</div>
                <div className="col-description">Disc tilted down (edge to ground)</div>
                <div className="col-effect">More fade</div>
              </div>
              <div className="table-row">
                <div className="col-name">Anhyzer</div>
                <div className="col-description">Disc tilted up (edge to sky)</div>
                <div className="col-effect">Turns more right (RHBH)</div>
              </div>
            </div>

            <p>These interact with disc stability. For example, throwing an overstable disc on an anhyzer might still fade left at the end (a flex shot).</p>
          </section>

          {/* Stability Types Section */}
          <section className="content-section">
            <h2>🌀 Stability Types</h2>
            <div className="stability-types">
              <div className="stability-type">
                <h4>Understable</h4>
                <p>Turns right easily (RHBH). Great for beginners or tailwinds.</p>
              </div>
              <div className="stability-type">
                <h4>Stable</h4>
                <p>Flies straight with minimal turn/fade.</p>
              </div>
              <div className="stability-type">
                <h4>Overstable</h4>
                <p>Fights right-turn, fades hard left. Good for headwinds or forehands.</p>
              </div>
            </div>
          </section>

          {/* Disc Selection Section */}
          <section className="content-section">
            <h2>🛠 Disc Selection Tips</h2>
            <div className="selection-table">
              <div className="table-header">
                <div className="col-level">Player Level</div>
                <div className="col-suggestion">Suggested Disc Types</div>
              </div>
              <div className="table-row">
                <div className="col-level">Beginner</div>
                <div className="col-suggestion">Midranges (Speed 4–6), Understable drivers (Speed 7–9)</div>
              </div>
              <div className="table-row">
                <div className="col-level">Intermediate</div>
                <div className="col-suggestion">Add fairway drivers & stable/overstable discs</div>
              </div>
              <div className="table-row">
                <div className="col-level">Advanced</div>
                <div className="col-suggestion">Full range of discs, use angles/stability creatively</div>
              </div>
            </div>

            <div className="recommendations">
              <h4>Great beginner disc options:</h4>
              <ul>
                <li>Innova Leopard <span className="flight-numbers">(7|5|-2|1)</span></li>
                <li>Discraft Buzzz <span className="flight-numbers">(5|4|-1|1)</span></li>
                <li>Latitude 64 Pure <span className="flight-numbers">(3|3|-1|1)</span></li>
              </ul>
            </div>
          </section>

          {/* Improvement Tips Section */}
          <section className="content-section">
            <h2>🧠 Want to Improve Faster?</h2>
            <div className="improvement-tips">
              <div className="tip">
                <h4>📹 Film your form</h4>
                <p>See what you're really doing.</p>
              </div>
              <div className="tip">
                <h4>🏞️ Field work</h4>
                <p>Throw into an open field, focusing on angles and form.</p>
              </div>
              <div className="tip">
                <h4>📉 Disc down</h4>
                <p>Slower discs help you build better mechanics.</p>
              </div>
              <div className="tip">
                <h4>🥅 Practice putting</h4>
                <p>Even 10–20 minutes a day helps massively.</p>
              </div>
              <div className="tip">
                <h4>👀 Watch pros</h4>
                <p>See how they control angles, footwork, and release.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default GetGood;