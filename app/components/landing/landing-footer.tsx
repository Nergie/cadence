import { Link } from "react-router";

const linkClass =
  "text-muted-foreground transition-colors hover:text-foreground";

export function LandingFooter({ signedIn }: { signedIn: boolean }) {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/" className="text-base font-bold tracking-tight">
            Cadence
          </Link>
          <p className="mt-2 max-w-xs text-muted-foreground">
            Structured courses for developers. Learn at your own pace.
          </p>
        </div>
        <nav className="flex gap-6">
          <Link to="/courses" className={linkClass}>
            Courses
          </Link>
          {signedIn ? (
            <Link to="/dashboard" className={linkClass}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Log In
              </Link>
              <Link to="/signup" className={linkClass}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}
