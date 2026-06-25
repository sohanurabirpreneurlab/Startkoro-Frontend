import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Menu, Shield, Sparkles, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { AdminModal } from "@/components/admin/AdminModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function navLinkClassName(isActive: boolean) {
  return [
    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]"
      : "text-slate-600 hover:bg-white hover:text-slate-950",
  ].join(" ");
}

export function Navbar() {
  const { user, can, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [authRequiredOpen, setAuthRequiredOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const initials = useMemo(() => {
    if (!user) return "";
    const a = user.firstName?.slice(0, 1) ?? "";
    const b = user.lastName?.slice(0, 1) ?? "";
    return (a + b).toUpperCase() || "U";
  }, [user]);

  function handleChatClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (user) {
      return;
    }

    event.preventDefault();
    setLoginOpen(false);
    setSignupOpen(false);
    setAuthRequiredOpen(true);
  }

  function handleAdminClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (!can("access-admin")) {
      return;
    }

    setAdminOpen(true);
  }

  function closeMobileMenu(): void {
    setMobileMenuOpen(false);
  }

  const isHome = location.pathname === "/";

  const productLinks = [
    { label: "Knowledge Base", href: isHome ? "#knowledge-base" : "/#knowledge-base", kind: "anchor" as const },
    { label: "AI Assistant", href: "/chat", kind: "assistant" as const },
    
    // { label: "Journey", href: isHome ? "#journey" : "/#journey", kind: "anchor" as const },
    // { label: "Tools", href: isHome ? "#tools" : "/#tools", kind: "anchor" as const },
    // Until a dedicated dashboard route exists, the chat workspace is the closest dashboard surface.
    // { label: "Dashboard", href: "/chat", kind: "dashboard" as const },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-[linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(248,250,252,0.84))] px-3 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-[linear-gradient(180deg,_rgba(248,250,252,0.92),_rgba(248,250,252,0.72))] sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl rounded-[26px] border border-white/80 bg-white/88 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex min-h-[74px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-7">
          <Link to="/" className="flex min-w-0 items-center gap-3 text-slate-950">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#10b981,_#14b8a6_50%,_#2563eb)] text-sm font-bold text-white shadow-[0_14px_32px_rgba(37,99,235,0.22)]">
              SK
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold tracking-tight">Start Koro AI</span>
              <span className="hidden text-xs text-slate-500 sm:block">
                Business guidance for Bangladesh
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/92 px-2 py-2 lg:flex">
          {productLinks.map((item) =>
            item.kind === "assistant" ? (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) => navLinkClassName(isActive)}
                onClick={handleChatClick}
              >
                {item.label}
              </NavLink>
            ) : (
              <a key={item.label} href={item.href} className={navLinkClassName(false)}>
                {item.label}
              </a>
            ),
          )}
          {can("access-admin") ? (
            <NavLink to="/admin" className={() => navLinkClassName(adminOpen)} onClick={handleAdminClick}>
              <span className="inline-flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </span>
            </NavLink>
          ) : null}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 xl:flex">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered business workspace
            </div>

            {!user ? (
              <>
                <Button
                  variant="ghost"
                  className="hidden rounded-full px-4 text-slate-700 hover:bg-slate-100 sm:inline-flex"
                  onClick={() => {
                    setSignupOpen(false);
                    setLoginOpen(true);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="hidden rounded-full border-slate-200 bg-white px-4 text-slate-800 shadow-sm hover:bg-slate-50 sm:inline-flex"
                  onClick={() => {
                    setLoginOpen(false);
                    setSignupOpen(true);
                  }}
                >
                  Sign up
                </Button>
                <Button
                  className="rounded-full border-0 bg-[linear-gradient(135deg,_#10b981,_#14b8a6_45%,_#2563eb)] px-5 text-white shadow-[0_14px_32px_rgba(37,99,235,0.18)] hover:opacity-95"
                  onClick={() => {
                    setSignupOpen(false);
                    setLoginOpen(true);
                  }}
                >
                  Ask AI
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className="hidden rounded-full border-0 bg-[linear-gradient(135deg,_#10b981,_#14b8a6_45%,_#2563eb)] px-5 text-white shadow-[0_14px_32px_rgba(37,99,235,0.18)] hover:opacity-95 sm:inline-flex"
                >
                  <Link to="/chat">Ask AI</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Profile"
                      className="h-10 w-10 rounded-full border-slate-200 bg-white shadow-sm"
                    >
                      <span className="sr-only">Profile</span>
                      <span className="text-xs font-semibold">{initials}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <div className="text-sm font-semibold tracking-tight">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => console.log("Profile (demo)")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile (demo)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      destructive
                      onSelect={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-slate-200 bg-white shadow-sm lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              title="Open menu"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="left-auto right-0 top-0 h-screen w-[86vw] max-w-[340px] translate-x-0 translate-y-0 rounded-none border-l border-r-0 border-t-0 border-b-0 p-0 shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
          <div className="flex h-full flex-col bg-white">
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="text-base font-semibold tracking-tight text-slate-950">Start Koro AI</div>
              <div className="mt-1 text-sm text-slate-500">Business guidance for Bangladesh</div>
            </div>

            <div className="flex-1 overflow-auto px-4 py-4">
              <nav className="space-y-2">
                {productLinks.map((item) =>
                  item.kind === "assistant" ? (
                    <NavLink
                      key={item.label}
                      to={item.href}
                      className={({ isActive }) =>
                        [
                          "block rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                          isActive ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100",
                        ].join(" ")
                      }
                      onClick={(event) => {
                        handleChatClick(event);
                        closeMobileMenu();
                      }}
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </a>
                  ),
                )}

                {can("access-admin") ? (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAdminOpen(true);
                    }}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </button>
                ) : null}
              </nav>
            </div>

            <div className="border-t border-slate-200 px-4 py-4">
              {!user ? (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => {
                      closeMobileMenu();
                      setSignupOpen(false);
                      setLoginOpen(true);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => {
                      closeMobileMenu();
                      setLoginOpen(false);
                      setSignupOpen(true);
                    }}
                  >
                    Sign up
                  </Button>
                  <Button
                    className="w-full rounded-full border-0 bg-[linear-gradient(135deg,_#10b981,_#14b8a6_45%,_#2563eb)] text-white"
                    onClick={() => {
                      closeMobileMenu();
                      setSignupOpen(false);
                      setLoginOpen(true);
                    }}
                  >
                    Ask AI
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  className="w-full rounded-full border-0 bg-[linear-gradient(135deg,_#10b981,_#14b8a6_45%,_#2563eb)] text-white"
                >
                  <Link to="/chat" onClick={closeMobileMenu}>
                    Ask AI
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AuthRequiredModal
        open={authRequiredOpen}
        onOpenChange={setAuthRequiredOpen}
        onLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
        onSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
        description="Please login or sign up to access chat."
      />
      <AdminModal open={adminOpen} onOpenChange={setAdminOpen} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
    </header>
  );
}
