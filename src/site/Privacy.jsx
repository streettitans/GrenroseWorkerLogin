import { useEffect, useState } from "react";
import { request } from "../register/api";
import "./site.css";
export default function Privacy({returnLabel='Back to registration',returnUrl='/'}) {
  const [policy, setPolicy] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    request("/api/privacy")
      .then((r) => setPolicy(r.data))
      .catch((e) => setError(e.message));
  }, []);
  return (
    <main className="sr-app sr-auth">
      <h1>Grenrose site register privacy</h1>
      <p>
        The site operator uses your name, contact details, company, trade and assigned sites to
        administer access. Registration is reviewed before a worker account is provisioned.
      </p>
      <p>
        Attendance records contain check-in/out times, site, company and trade. At check-in, your
        device reports precise coordinates and accuracy to assess the site boundary. GPS is not
        independently verified proof of presence. Administrators and read-only viewers can access
        register information; a worker can access their own attendance.
      </p>
      <p>
        Account email is sent through the operator’s configured SMTP provider. QR links and
        password-reset links must be kept private.
      </p>
      {error && <p role="alert">{error}</p>}
      {policy && (
        <>
          <p>
            Privacy contact:{" "}
            {policy.contact ||
              "Not configured. Do not submit real personal data until the operator publishes its contact and approved retention policy."}
          </p>
          <p>
            Precise location retention:{" "}
            {policy.locationRetentionDays
              ? `${policy.locationRetentionDays} days after check-out, subject to the operator running its approved retention process.`
              : "Not yet configured."}
          </p>
        </>
      )}
      <p>
        Contact the site operator to request access, correction or review of your personal
        information. Attendance, account and audit retention and backup expiry must follow the
        operator’s approved policy; this notice does not establish a lawful basis or replace that
        policy.
      </p>
      <a href={returnUrl}>{returnLabel}</a>
    </main>
  );
}

