import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChatLayout } from "../components/chat/ChatLayout";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";

export function ChatPage() {
  const { user } = useAuth();
  const { loadChats, resetChatState } = useChat();
  const { t } = useTranslation();
  const [authRequiredOpen, setAuthRequiredOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      resetChatState();
      return;
    }

    void loadChats().catch(() => undefined);
  }, [loadChats, resetChatState, user]);

  useEffect(() => {
    setAuthRequiredOpen(!user);

    if (user) {
      setLoginOpen(false);
      setSignupOpen(false);
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <div className="flex h-full items-center justify-center px-4">
          <div className="max-w-md rounded-xl border bg-card/70 p-6 text-center text-sm text-muted-foreground backdrop-blur">
            {t("chat.authMessage")}
          </div>
        </div>
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
          description={t("auth.chatsRequiredDescription")}
        />
        <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
        <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
      </>
    );
  }

  return <ChatLayout />;
}
