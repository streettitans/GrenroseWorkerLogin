import { useCallback, useEffect, useRef, useState } from "react";

import { request } from "../register/api";

import AccountAccess from "./AccountAccess";

import "./site.css";

const date = (value) =>
  value
    ? new Date(value).toLocaleString("en-GB", { timeZone: "Europe/London", hour12: false })
    : "—";

export default function WorkerPortal({ standalone = false }) {
  const [session, setSession] = useState(null),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false);

  const [credentials, setCredentials] = useState({ email: "", password: "" }),
    [rows, setRows] = useState([]),
    [qrSite, setQrSite] = useState(null),
    [qrToken, setQrToken] = useState(
      () => new URLSearchParams(window.location.search).get("token") || "",
    );

  const [view, setView] = useState(
      window.location.pathname.includes("shifts") || window.location.pathname.includes("timesheets")
        ? "history"
        : "clock",
    ),
    [refreshed, setRefreshed] = useState(""),
    [stale, setStale] = useState(false),
    [connectionError, setConnectionError] = useState(""),
    [historyPage, setHistoryPage] = useState(1),
    [pagination, setPagination] = useState(null);

  const busy = useRef(false),
    refreshBusy = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshBusy.current) return;
    refreshBusy.current = true;

    try {
      const result = await request("/api/worker/me");
      setSession(result.data);
      setRefreshed(new Date().toISOString());
      setStale(false);
      setConnectionError("");
    } catch (e) {
      if (e.status === 401 || e.status === 403) setSession(null);
      else {
        setConnectionError(`Attendance could not refresh. ${e.message}`);
        setStale(true);
      }
    } finally {
      refreshBusy.current = false;
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    request("/api/worker/attendance?page=" + historyPage + "&pageSize=50", {
      signal: controller.signal,
    })
      .then((r) => {
        setRows(r.data);
        setPagination(r.pagination);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [session?.current?.id, session?.current?.checkOut, view, refreshed, historyPage]);

  useEffect(() => {
    setQrSite(null);
    if (!session || !qrToken) return;
    const controller = new AbortController();
    request("/api/worker/site?token=" + encodeURIComponent(qrToken), { signal: controller.signal })
      .then((r) => setQrSite(r.data))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [!!session, qrToken]);

  async function login(e) {
    e.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      await request("/api/worker/login", { method: "POST", body: credentials });
      setCredentials({ email: "", password: "" });
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  async function logout() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    try {
      await request("/api/worker/logout", { method: "POST" });
      setSession(null);
      setRows([]);
      setQrSite(null);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  async function checkIn() {
    if (busy.current || !qrSite || stale) return;
    busy.current = true;
    setPending(true);
    setError("");

    try {
      if (!navigator.geolocation)
        throw new Error("Location is unavailable on this device. Contact the site team.");

      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          resolve,
          () =>
            reject(
              new Error(
                "Location access is required. Allow location access or contact the site team.",
              ),
            ),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
        ),
      );

      const { latitude, longitude, accuracy } = position.coords;

      await request("/api/worker/check-in", {
        method: "POST",
        body: {
          siteId: qrSite.id,
          qrToken,
          latitude,
          longitude,
          accuracy,
          positionTimestamp: position.timestamp,
        },
      });
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  async function checkOut() {
    if (busy.current || !session?.current || stale) return;
    busy.current = true;
    setPending(true);
    setError("");

    try {
      await request("/api/worker/check-out", {
        method: "POST",
        body: { attendanceId: session.current.id },
      });
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  function parseQr(value) {
    try {
      const url = new URL(value);
      const token = url.searchParams.get("token");
      if (token) return token;
    } catch {}
    return value.trim();
  }

  if (
    window.location.pathname.includes("reset") ||
    window.location.pathname.includes("recover") ||
    window.location.pathname.includes("forgot-password")
  )
    return <AccountAccess accountType="worker" loginUrl={standalone ? "/login" : "/worker"} />;

  if (!ready)
    return (
      <main className="sr-app sr-auth">
        <p role="status">Checking your worker session…</p>
      </main>
    );

  if (!session)
    return (
      <main className="sr-app sr-auth">
        <h1>Grenrose Worker Portal</h1>
        <h2>Sign in to your site register</h2>
        <p>
          Use the email and password set through your invitation. Site attendance is stored in the
          shared register.
        </p>
        {error && (
          <p className="sr-error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={login}>
          <label>
            Email
            <input
              type="email"
              autoComplete="username"
              required
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              maxLength={128}
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </label>
          <button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
        </form>
        <a href={standalone ? "/forgot-password" : "/worker/recover"}>Forgot password?</a>
        {!standalone && (
          <p>
            <a href="/">Register your details</a>
          </p>
        )}
      </main>
    );

  return (
    <main className="sr-app sr-worker">
      <header>
        <div>
          <h1>Grenrose</h1>
          <p className="sr-identity">
            {session.worker.name} · {session.worker.company} · {session.worker.trade}
          </p>
        </div>
        <nav>
          <button className="sr-secondary" onClick={() => setView("clock")}>
            Site attendance
          </button>
          <button className="sr-secondary" onClick={() => setView("history")}>
            My attendance
          </button>
          <button disabled={pending} className="sr-secondary" onClick={logout}>
            Sign out
          </button>
        </nav>
      </header>

      {connectionError && (
        <p className="sr-error" role="alert">
          {connectionError}
        </p>
      )}
      {error && (
        <p className="sr-error" role="alert">
          {error}
        </p>
      )}
      <p className="sr-muted">
        Last refreshed {date(refreshed)}.{" "}
        {stale
          ? "Connection lost — displayed data may be stale."
          : "Shared register refreshes every 5 seconds."}
      </p>

      {view === "clock" ? (
        <>
          {session.current ? (
            <section className="sr-card sr-live">
              <h2>On site: {session.current.site}</h2>
              <p>Checked in {date(session.current.checkIn)}</p>
              <button disabled={pending || stale} onClick={checkOut}>
                {pending ? "Processing…" : "Check out"}
              </button>
            </section>
          ) : (
            <section className="sr-card">
              <h2>Check in at your site</h2>
              <p>
                Scan the QR code at the entrance with your phone camera. You can also paste the full
                QR link below.
              </p>
              <label>
                Site QR link
                <input
                  value={qrToken}
                  onChange={(e) => setQrToken(parseQr(e.target.value))}
                  placeholder="Paste the site QR link"
                />
              </label>

              {qrSite ? (
                <>
                  <h3>{qrSite.name}</h3>
                  <p>
                    {qrSite.address} · {qrSite.radius}m check-in radius
                  </p>
                  <p>
                    A fresh location is required. GPS accuracy must fit within the site boundary.
                  </p>
                  <button disabled={pending || stale} onClick={checkIn}>
                    {pending ? "Checking location…" : "Share location & check in"}
                  </button>
                </>
              ) : (
                <p>No valid assigned site QR code selected.</p>
              )}
            </section>
          )}

          <section className="sr-card">
            <h2>Your assigned sites</h2>
            {session.sites.length ? (
              session.sites.map((s) => (
                <div key={s.id}>
                  <h3>{s.name}</h3>
                  <p>{s.address}</p>
                </div>
              ))
            ) : (
              <p>No active sites are assigned to you. Contact the site team.</p>
            )}
          </section>
        </>
      ) : (
        <section>
          <h2>My attendance</h2>
          <p>
            Times are displayed in Europe/London. Open records continue accruing attendance duration
            until check-out.
          </p>
          <div className="sr-table">
            <table>
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.site}</td>
                    <td>{date(r.checkIn)}</td>
                    <td>{date(r.checkOut)}</td>
                    <td>{r.durationMinutes} min</td>
                    <td>{r.status === "on-site" ? "On site" : "Left"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && <p>No attendance records yet.</p>}
          </div>
          <div className="sr-actions">
            <button disabled={historyPage === 1} onClick={() => setHistoryPage(historyPage - 1)}>
              Previous records
            </button>
            <span>
              Page {historyPage} of {pagination?.totalPages || 1}
            </span>
            <button
              disabled={!pagination || historyPage >= pagination.totalPages}
              onClick={() => setHistoryPage(historyPage + 1)}
            >
              Next records
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
