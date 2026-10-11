import { useState } from "react";
import { HoldToCommit } from "./components/hold-to-commit";

export function App() {
  const [deleted, setDeleted] = useState(false);
  return (
    <main className="page">
      <header><p className="eyebrow">Ledgerline · Settings</p><h1>Workspace settings</h1></header>
      <section className="card">
        <h2>Workspace name</h2>
        <label htmlFor="ws">Name</label>
        <input id="ws" defaultValue="Rahman & Sons Accounts" />
        <button className="btn">Save</button>
      </section>
      <section className="card">
        <h2>Members</h2>
        <p>4 members · 1 pending invite</p>
      </section>
      <section className="card danger">
        <h2>Delete workspace</h2>
        <p>Deletes all ledgers, invoices and attachments for every member. This cannot be undone.</p>
        {deleted ? <p role="status">Workspace scheduled for deletion.</p> : (
          <>
            <HoldToCommit label="Hold to delete workspace" doneLabel="Deleting…" holdMs={1500} onCommit={() => setDeleted(true)} className="hold-danger" />
            <p className="hint">Press and hold for 1.5 seconds. Release early to cancel. Keyboard: hold Space or Enter.</p>
          </>
        )}
      </section>
    </main>
  );
}
