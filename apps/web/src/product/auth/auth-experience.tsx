import { AuthGradient } from "@agentplace/ui/components/ap-ambient";
import { ClientLogos, Logo } from "@agentplace/ui/components/ap-brand";
import {
	FormField,
	OtpField,
	PasswordField,
} from "@agentplace/ui/components/ap-controls";
import { Badge, Surface } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import { Button } from "@agentplace/ui/components/button";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import "./auth-experience.css";

type AuthScreen = "login" | "signup" | "verify" | "recovery";
type SignInMethod = "email" | "google";

const methodPreference = "agentplace-prototype-sign-in-method";
const resendDelay = 55;
const verificationPreviewDuration = 1400;

interface VerificationPreview {
	email: string;
	code?: string;
	processing?: boolean;
}

function readLastMethod(): SignInMethod {
	try {
		return sessionStorage.getItem(methodPreference) === "google"
			? "google"
			: "email";
	} catch {
		return "email";
	}
}

function rememberMethod(method: SignInMethod) {
	try {
		sessionStorage.setItem(methodPreference, method);
	} catch {
		// Storage is optional for this presentation preference.
	}
}

export interface AuthExperienceProps {
	onAuthenticated: (account: { email?: string; isNewAccount: boolean }) => void;
	initialScreen?: AuthScreen;
	initialLastMethod?: SignInMethod;
	verificationPreview?: VerificationPreview;
}

export function AuthExperience({
	onAuthenticated,
	initialScreen = "login",
	initialLastMethod,
	verificationPreview,
}: AuthExperienceProps) {
	const [screen, setScreen] = useState(initialScreen);
	const [lastMethod] = useState(() => initialLastMethod ?? readLastMethod());
	const [email, setEmail] = useState(verificationPreview?.email ?? "");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);
	const [code, setCode] = useState(verificationPreview?.code ?? "");
	const [verifying, setVerifying] = useState(
		verificationPreview?.processing ?? false,
	);
	const [resendUntil, setResendUntil] = useState<number | null>(null);
	const [resendSeconds, setResendSeconds] = useState(resendDelay);
	const [notice, setNotice] = useState("");
	const pendingVerification = useRef<number | undefined>(undefined);
	const form = useRef<HTMLFormElement>(null);
	const heading = useRef<HTMLHeadingElement>(null);
	const previousScreen = useRef(screen);
	const resultCallback = useRef(onAuthenticated);
	const id = useId();

	const signup = screen === "signup";
	const verification = screen === "verify";
	const recovery = screen === "recovery";
	const googleLastUsed = screen === "login" && lastMethod === "google";

	useEffect(() => {
		if (screen === "verify" && !verificationPreview?.code) {
			form.current?.querySelector<HTMLInputElement>(".ap-otp input")?.focus();
		} else if (previousScreen.current !== screen) {
			heading.current?.focus();
		}
		previousScreen.current = screen;
	}, [screen, verificationPreview?.code]);

	useEffect(() => {
		resultCallback.current = onAuthenticated;
	}, [onAuthenticated]);

	useEffect(() => {
		if (!verification || resendUntil === null) return;
		function tick() {
			if (resendUntil === null) return;
			const seconds = Math.max(0, Math.ceil((resendUntil - Date.now()) / 1000));
			setResendSeconds(seconds);
			if (seconds === 0) setResendUntil(null);
		}
		const interval = window.setInterval(tick, 250);
		return () => window.clearInterval(interval);
	}, [verification, resendUntil]);

	useEffect(() => () => window.clearTimeout(pendingVerification.current), []);

	function startCooldown() {
		setResendSeconds(resendDelay);
		setResendUntil(Date.now() + resendDelay * 1000);
	}

	function switchScreen(next: AuthScreen) {
		window.clearTimeout(pendingVerification.current);
		pendingVerification.current = undefined;
		setScreen(next);
		setErrors({});
		setNotice("");
		setPassword("");
		setCode("");
		setVerifying(false);
		setResendUntil(null);
	}

	function signInWithGoogle() {
		rememberMethod("google");
		onAuthenticated({ isNewAccount: false });
	}

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (verification) {
			if (
				code.length !== 6 ||
				verifying ||
				pendingVerification.current !== undefined
			)
				return;
			setVerifying(true);
			// The local prototype accepts any six digits and briefly shows the designed pending state.
			pendingVerification.current = window.setTimeout(() => {
				pendingVerification.current = undefined;
				setVerifying(false);
				rememberMethod("email");
				resultCallback.current({ email, isNewAccount: true });
			}, verificationPreviewDuration);
			return;
		}
		const address = email.trim();
		const emailInvalid =
			form.current?.querySelector<HTMLInputElement>('[name="email"]')?.validity
				.typeMismatch;
		const emailError =
			!address || emailInvalid ? "Enter a valid email address." : undefined;
		const passwordError = recovery
			? undefined
			: !password
				? "Enter your password."
				: signup && password.length < 8
					? "Use at least 8 characters."
					: undefined;
		setErrors({ email: emailError, password: passwordError });
		if (emailError || passwordError) {
			form.current
				?.querySelector<HTMLInputElement>(
					emailError ? '[name="email"]' : '[name="password"]',
				)
				?.focus();
			return;
		}
		setEmail(address);
		if (recovery) {
			setNotice(
				"This prototype previews the recovery flow. No email was sent.",
			);
			return;
		}
		if (signup) {
			switchScreen("verify");
			startCooldown();
			return;
		}
		rememberMethod("email");
		onAuthenticated({ email: address, isNewAccount: false });
	}

	function resendCode() {
		if (resendSeconds > 0 || verifying) return;
		setCode("");
		startCooldown();
		setNotice("Code reset. Enter any six digits to continue in the prototype.");
		form.current?.querySelector<HTMLInputElement>(".ap-otp input")?.focus();
	}

	const title = verification
		? "Confirm your email"
		: recovery
			? "Reset your password"
			: signup
				? "Create your account"
				: "Log in or sign up";

	return (
		<main className="product-auth-shell">
			<AuthGradient className="product-auth-ambient" />
			<header className="product-auth-brand">
				<Logo cycleDuration={32} />
			</header>
			<Surface className="product-auth-card" elevation="resting">
				<form
					className="product-auth-form"
					aria-labelledby={`${id}-title`}
					ref={form}
					onSubmit={submit}
					noValidate
				>
					<h1 id={`${id}-title`} ref={heading} tabIndex={-1}>
						{title}
					</h1>
					{verification ? (
						<>
							<div className="product-auth-destination">
								<p>Check your email for a 6-digit code.</p>
								<p>{email}</p>
							</div>
							<div className="product-auth-verification">
								<div className="product-auth-code-label">
									<span className="ap-field-label">Verification code</span>
									{resendSeconds > 0 ? (
										<span>Resend code in {resendSeconds}s</span>
									) : (
										<button
											type="button"
											className="product-auth-resend"
											disabled={verifying}
											onClick={resendCode}
										>
											Resend code
										</button>
									)}
								</div>
								<OtpField
									value={code}
									onValueChange={setCode}
									processing={verifying}
									initialFocus={false}
								/>
								<p
									className="product-auth-hint"
									title="For this prototype, any six digits work."
								>
									{verifying
										? "Verifying your email. This will only take a moment."
										: "You can paste the full code from your email."}
								</p>
								<p className="sr-only">
									For this prototype, you can enter any six digits.
								</p>
								{notice && (
									<p role="status" className="product-auth-hint">
										{notice}
									</p>
								)}
							</div>
							<div className="product-auth-actions">
								<Button
									type="submit"
									size="medium"
									loading={verifying}
									disabled={code.length !== 6}
								>
									{verifying ? "Verifying…" : "Verify email"}
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="medium"
									onClick={() => switchScreen("signup")}
								>
									Use a different email
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="medium"
									onClick={() => switchScreen("login")}
								>
									Back to sign in
								</Button>
							</div>
						</>
					) : (
						<>
							{recovery ? (
								<p className="product-auth-destination">
									Enter the email for your account.
								</p>
							) : (
								<>
									<Button
										type="button"
										variant="ghost"
										size="medium"
										className="product-auth-google"
										onClick={signInWithGoogle}
									>
										<span className="product-auth-google-label">
											<Icon name="google" size={20} />
											<span className="ap-button-label">
												Continue with Google
											</span>
										</span>
										{googleLastUsed && <Badge>Last Used</Badge>}
									</Button>
									<div className="product-auth-alternative">
										{signup
											? "Or sign up with email"
											: "Or use email and password"}
										{!signup && !googleLastUsed && <Badge>Last Used</Badge>}
									</div>
								</>
							)}
							<div className="product-auth-fields">
								<FormField
									label="Email"
									name="email"
									type="email"
									required
									autoComplete="email"
									placeholder="you@company.com"
									value={email}
									state={errors.email ? "error" : "default"}
									showSupportingText={Boolean(errors.email)}
									errorMessage={errors.email}
									onChange={(event) => {
										setEmail(event.target.value);
										setErrors((current) => ({ ...current, email: undefined }));
										setNotice("");
									}}
								/>
								{!recovery && (
									<div className="product-auth-password">
										<PasswordField
											name="password"
											placeholder={
												signup ? "Create a password" : "Enter your password"
											}
											autoComplete={
												signup ? "new-password" : "current-password"
											}
											showRecovery={!signup}
											onRecovery={() => switchScreen("recovery")}
											value={password}
											required
											state={errors.password ? "error" : "default"}
											aria-describedby={
												errors.password ? `${id}-password-error` : undefined
											}
											aria-invalid={errors.password ? true : undefined}
											onChange={(event) => {
												setPassword(event.target.value);
												setErrors((current) => ({
													...current,
													password: undefined,
												}));
											}}
										/>
										{errors.password && (
											<p
												id={`${id}-password-error`}
												className="ap-field-support ap-field-error"
												role="alert"
											>
												{errors.password}
											</p>
										)}
									</div>
								)}
								{notice && (
									<p className="product-auth-hint" role="status">
										{notice}
									</p>
								)}
							</div>
							<div className="product-auth-actions">
								<Button type="submit" size="medium">
									{recovery
										? "Request reset link"
										: signup
											? "Create account"
											: "Sign in"}
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="medium"
									onClick={() =>
										switchScreen(signup || recovery ? "login" : "signup")
									}
								>
									{signup || recovery ? "Back to sign in" : "Create an account"}
								</Button>
							</div>
						</>
					)}
					<p className="product-auth-legal">
						By continuing, you agree to the Terms &amp; Conditions and
						acknowledge the Privacy Policy.
					</p>
				</form>
			</Surface>
			<footer className="product-auth-footer">
				<ClientLogos />
			</footer>
		</main>
	);
}
