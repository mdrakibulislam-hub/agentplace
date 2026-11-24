import { AuthGradient } from "@agentplace/ui/components/ap-ambient";
import { ClientLogos, Logo } from "@agentplace/ui/components/ap-brand";
import {
	FormField,
	OtpField,
	PasswordField,
} from "@agentplace/ui/components/ap-controls";
import { Badge, Surface } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import { useContentEntrance } from "@agentplace/ui/components/ap-motion";
import { Button } from "@agentplace/ui/components/button";
import {
	type FormEvent,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import "./auth-experience.css";

type AuthScreen = "login" | "signup" | "verify" | "recovery";
type SignInMethod = "email" | "google";

const methodPreference = "agentplace-prototype-sign-in-method";
interface VerificationPreview {
	email: string;
	code?: string;
	processing?: boolean;
	resendDelaySeconds?: number;
}

function secondsUntil(deadline: number | null) {
	return deadline === null || !Number.isFinite(deadline)
		? 0
		: Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

function validateEmail(address: string, typeMismatch: boolean) {
	return !address.trim() || typeMismatch
		? "Enter a valid email address."
		: undefined;
}

function validatePassword(password: string, signup: boolean) {
	if (!password) return "Enter your password.";
	if (signup && password.length < 8) return "Use at least 8 characters.";
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
	onVerify?: (
		email: string,
		code: string,
		signal: AbortSignal,
	) => Promise<void>;
	onResendCode?: (
		email: string,
		signal: AbortSignal,
	) => Promise<{ resendAt?: number }>;
	initialScreen?: AuthScreen;
	initialLastMethod?: SignInMethod;
	verificationPreview?: VerificationPreview;
}

export function AuthExperience({
	onAuthenticated,
	onVerify,
	onResendCode,
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
	const [pending, setPending] = useState<"verify" | "resend" | null>(
		verificationPreview?.processing ? "verify" : null,
	);
	const [resendUntil, setResendUntil] = useState<number | null>(() =>
		verificationPreview?.resendDelaySeconds
			? Date.now() + verificationPreview.resendDelaySeconds * 1000
			: null,
	);
	const [resendSeconds, setResendSeconds] = useState(() =>
		secondsUntil(resendUntil),
	);
	const [notice, setNotice] = useState("");
	const [verificationError, setVerificationError] = useState<{
		action: "verify" | "resend";
		message: string;
	}>();
	const pendingVerification = useRef<AbortController | null>(null);
	const form = useRef<HTMLFormElement>(null);
	const heading = useRef<HTMLHeadingElement>(null);
	const backToLogin = useRef<HTMLButtonElement>(null);
	const verifyButton = useRef<HTMLButtonElement>(null);
	const resendButton = useRef<HTMLButtonElement>(null);
	const restoreVerificationFocus = useRef<"code" | "resend" | null>(null);
	const focusEmail = useRef(false);
	const previousScreen = useRef(screen);
	const resultCallback = useRef(onAuthenticated);
	const id = useId();

	const signup = screen === "signup";
	const verification = screen === "verify";
	const recovery = screen === "recovery";
	const googleLastUsed = screen === "login" && lastMethod === "google";
	const verifying = pending === "verify";
	const resending = pending === "resend";
	useContentEntrance(form, screen);

	useLayoutEffect(() => {
		if (screen === "verify" && !verificationPreview?.code) {
			form.current?.querySelector<HTMLInputElement>(".ap-otp input")?.focus();
		} else if (focusEmail.current) {
			focusEmail.current = false;
			const emailInput =
				form.current?.querySelector<HTMLInputElement>('[name="email"]');
			emailInput?.focus();
			emailInput?.select();
		} else if (screen === "login" && previousScreen.current === "recovery") {
			form.current
				?.querySelector<HTMLElement>(".ap-password-recovery")
				?.focus();
		} else if (screen === "login" && previousScreen.current === "signup") {
			backToLogin.current?.focus();
		} else if (previousScreen.current !== screen) {
			heading.current?.focus();
		}
		previousScreen.current = screen;
	}, [screen, verificationPreview?.code]);

	useLayoutEffect(() => {
		if (pending || !restoreVerificationFocus.current) return;
		const target = restoreVerificationFocus.current;
		restoreVerificationFocus.current = null;
		if (target === "resend") resendButton.current?.focus();
		else
			form.current?.querySelector<HTMLInputElement>(".ap-otp input")?.focus();
	}, [pending]);

	useEffect(() => {
		resultCallback.current = onAuthenticated;
	}, [onAuthenticated]);

	useEffect(() => {
		if (!verification || resendUntil === null) return;
		function tick() {
			const seconds = secondsUntil(resendUntil);
			setResendSeconds(seconds);
			if (seconds === 0) setResendUntil(null);
		}
		const interval = window.setInterval(tick, 1000);
		return () => window.clearInterval(interval);
	}, [verification, resendUntil]);

	useEffect(() => () => pendingVerification.current?.abort(), []);

	function switchScreen(next: AuthScreen) {
		pendingVerification.current?.abort();
		pendingVerification.current = null;
		setScreen(next);
		setErrors({});
		setNotice("");
		setVerificationError(undefined);
		setPassword("");
		setCode("");
		setPending(null);
		restoreVerificationFocus.current = null;
		setResendUntil(null);
		setResendSeconds(0);
	}

	function signInWithGoogle() {
		rememberMethod("google");
		onAuthenticated({ isNewAccount: false });
	}

	async function verify() {
		if (code.length !== 6 || pending || pendingVerification.current) return;
		if (onVerify) {
			const controller = new AbortController();
			pendingVerification.current = controller;
			setPending("verify");
			setVerificationError(undefined);
			try {
				await onVerify(email, code, controller.signal);
				if (controller.signal.aborted) return;
			} catch (error) {
				if (!controller.signal.aborted) {
					if (
						document.activeElement === document.body ||
						document.activeElement === verifyButton.current
					)
						restoreVerificationFocus.current = "code";
					setVerificationError({
						action: "verify",
						message:
							error instanceof Error
								? error.message
								: "Couldn’t verify the code. Try again.",
					});
				}
				return;
			} finally {
				if (pendingVerification.current === controller) {
					pendingVerification.current = null;
					setPending(null);
				}
			}
		}
		rememberMethod("email");
		resultCallback.current({ email, isNewAccount: true });
	}

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (verification) {
			void verify();
			return;
		}
		const address = email.trim();
		const emailError = validateEmail(
			address,
			Boolean(
				form.current?.querySelector<HTMLInputElement>('[name="email"]')
					?.validity.typeMismatch,
			),
		);
		const passwordError = recovery
			? undefined
			: validatePassword(password, signup);
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
			return;
		}
		rememberMethod("email");
		onAuthenticated({ email: address, isNewAccount: false });
	}

	async function resendCode() {
		if (secondsUntil(resendUntil) > 0 || pending || pendingVerification.current)
			return;
		if (onResendCode) {
			const controller = new AbortController();
			pendingVerification.current = controller;
			setPending("resend");
			setVerificationError(undefined);
			setNotice("");
			try {
				const result = await onResendCode(email, controller.signal);
				if (controller.signal.aborted) return;
				const deadline = result.resendAt ?? null;
				setResendUntil(deadline);
				setResendSeconds(secondsUntil(deadline));
				if (
					document.activeElement === document.body ||
					document.activeElement === resendButton.current
				)
					restoreVerificationFocus.current = "code";
				setNotice("A new code was sent.");
			} catch (error) {
				if (!controller.signal.aborted) {
					if (document.activeElement === document.body)
						restoreVerificationFocus.current = "resend";
					setVerificationError({
						action: "resend",
						message:
							error instanceof Error
								? error.message
								: "Couldn’t send a new code. Try again.",
					});
				}
				return;
			} finally {
				if (pendingVerification.current === controller) {
					pendingVerification.current = null;
					setPending(null);
				}
			}
		} else {
			setNotice("Code cleared.");
			form.current?.querySelector<HTMLInputElement>(".ap-otp input")?.focus();
		}
		setCode("");
		setVerificationError(undefined);
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
								<p>
									{onVerify || verificationPreview
										? "Check your email for a 6-digit code."
										: "Enter any 6-digit code to continue in the prototype."}
								</p>
								<p>{email}</p>
							</div>
							<div className="product-auth-verification">
								<div className="product-auth-code-label">
									<span className="ap-field-label">Verification code</span>
									{resendSeconds > 0 ? (
										<span>Resend code in {resendSeconds}s</span>
									) : (
										<Button
											ref={resendButton}
											type="button"
											variant="ghost"
											className="product-auth-resend"
											disabled={verifying}
											loading={resending}
											aria-describedby={
												verificationError?.action === "resend"
													? `${id}-resend-error`
													: undefined
											}
											onClick={resendCode}
										>
											{onResendCode ? "Resend code" : "Reset code"}
										</Button>
									)}
								</div>
								<OtpField
									value={code}
									onValueChange={(value) => {
										setCode(value);
										setVerificationError(undefined);
										setNotice("");
									}}
									processing={verifying}
									disabled={resending}
									error={
										verificationError?.action === "verify"
											? verificationError.message
											: undefined
									}
									initialFocus={false}
								/>
								{verificationError?.action === "resend" && (
									<p
										id={`${id}-resend-error`}
										className="ap-field-support ap-field-error"
										role="alert"
									>
										{verificationError.message}
									</p>
								)}
								<p className="product-auth-hint" role="status">
									{verifying
										? "Verifying your email…"
										: resending
											? "Sending a new code…"
											: "You can paste the full code."}
								</p>
								{notice && (
									<p role="status" className="product-auth-hint">
										{notice}
									</p>
								)}
							</div>
							<div className="product-auth-actions">
								<Button
									ref={verifyButton}
									type="submit"
									size="medium"
									loading={verifying}
									disabled={code.length !== 6 || resending}
								>
									{verifying ? "Verifying…" : "Verify email"}
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="medium"
									onClick={() => {
										switchScreen("signup");
										focusEmail.current = true;
									}}
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
										const { value, validity } = event.currentTarget;
										setEmail(value);
										if (errors.email) {
											setErrors((current) => ({
												...current,
												email: validateEmail(value, validity.typeMismatch),
											}));
										}
										setNotice("");
									}}
								/>
								{!recovery && (
									<div className="product-auth-password">
										<PasswordField
											key={screen}
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
												const { value } = event.currentTarget;
												setPassword(value);
												if (errors.password) {
													setErrors((current) => ({
														...current,
														password: validatePassword(value, signup),
													}));
												}
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
									ref={backToLogin}
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
